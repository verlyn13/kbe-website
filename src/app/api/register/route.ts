import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { profileService, registrationService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';
import {
  logApiError,
  batchOperation,
  validateRequestBody,
  withRetry,
} from '@/lib/api-error-handler';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let userId: string | undefined;

  try {
    const body = await request.json();
    const { parent, students, program } = body;

    // Validate required fields
    const validation = validateRequestBody(body, ['parent', 'students', 'program']);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          details: { missing: validation.missing },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Registration API uses Supabase auth
    const USE_SUPABASE_AUTH = process.env.NEXT_PUBLIC_USE_SUPABASE_AUTH === 'true';

    if (!USE_SUPABASE_AUTH) {
      return NextResponse.json(
        {
          error: 'Registration through this API requires Supabase auth to be enabled',
          code: 'SUPABASE_AUTH_REQUIRED',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create auth account with retry for transient failures
    const { data: authData, error: authError } = await withRetry(
      () =>
        supabase.auth.signUp({
          email: parent.email,
          password: parent.password,
          options: {
            data: {
              full_name: parent.fullName,
            },
          },
        }),
      {
        context: 'REGISTRATION_AUTH_SIGNUP',
        email: parent.email,
        additionalData: {
          step: 'auth_signup',
        },
      },
      2, // Max 2 retries
      500 // 500ms delay
    );

    if (authError || !authData.user) {
      logApiError(authError || new Error('No user returned'), {
        context: 'REGISTRATION_AUTH_FAILED',
        email: parent.email,
        requestPath: request.url,
        requestMethod: 'POST',
        additionalData: {
          step: 'auth_signup',
          errorMessage: authError?.message,
        },
      });

      return NextResponse.json(
        {
          error: authError?.message || 'Failed to create account',
          code: 'AUTH_SIGNUP_FAILED',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const user = authData.user;
    userId = user.id;

    // Create user profile
    await profileService.upsert({
      id: user.id,
      email: parent.email,
      name: parent.fullName,
      phone: parent.phone,
      role: 'GUARDIAN',
    });

    console.log(`[REGISTRATION] Profile created for user ${user.id}`);

    // Create students using batch operation for better error handling
    const studentPromises = students.map((student: any) =>
      prisma.student.create({
        data: {
          userId: user.id,
          name: student.name,
          dateOfBirth: new Date(student.dateOfBirth),
          grade: student.grade,
          school: student.school || null,
          medicalNotes: student.medicalInfo || null,
        },
      })
    );

    const studentResults = await batchOperation(studentPromises, {
      context: 'REGISTRATION_CREATE_STUDENTS',
      userId: user.id,
      email: parent.email,
      additionalData: {
        studentCount: students.length,
      },
    });

    // Check if any students failed to create
    if (studentResults.failed.length > 0) {
      console.warn(
        `[REGISTRATION] ${studentResults.failed.length} of ${studentResults.total} students failed to create`
      );

      // If ALL students failed, return error
      if (studentResults.succeeded.length === 0) {
        throw new Error('Failed to create any students');
      }
    }

    console.log(
      `[REGISTRATION] Created ${studentResults.succeeded.length} students for user ${user.id}`
    );

    // Create registrations for successfully created students
    const registrationPromises = studentResults.succeeded.map(student =>
      registrationService.create({
        userId: user.id,
        studentId: student.id,
        programId: program.id,
        status: 'PENDING',
      })
    );

    const registrationResults = await batchOperation(registrationPromises, {
      context: 'REGISTRATION_CREATE_REGISTRATIONS',
      userId: user.id,
      email: parent.email,
      additionalData: {
        programId: program.id,
        registrationCount: registrationPromises.length,
      },
    });

    console.log(
      `[REGISTRATION] Created ${registrationResults.succeeded.length} registrations for user ${user.id}`
    );

    // Return success with details about partial failures if any
    const response: any = {
      success: true,
      userId: user.id,
      studentsCreated: studentResults.succeeded.length,
      registrationsCreated: registrationResults.succeeded.length,
    };

    // Include warnings about failures if any
    if (studentResults.failed.length > 0 || registrationResults.failed.length > 0) {
      response.warnings = {
        studentFailures: studentResults.failed.length,
        registrationFailures: registrationResults.failed.length,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    // Log error with full context
    logApiError(error, {
      context: 'REGISTRATION_FAILED',
      userId,
      requestPath: request.url,
      requestMethod: 'POST',
      additionalData: {
        hasUserId: !!userId,
      },
    });

    return NextResponse.json(
      {
        error: 'Failed to complete registration',
        code: 'REGISTRATION_FAILED',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
