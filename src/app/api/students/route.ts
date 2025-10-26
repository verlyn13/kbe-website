import { type NextRequest, NextResponse } from 'next/server';
import { studentService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';
import { logApiError, createErrorResponse } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Get students for the current user
    const students = await studentService.getByUserId(user.id);

    console.log(`[STUDENTS_GET] Retrieved ${students.length} students for user ${user.id}`);

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'STUDENTS_GET',
      userId: user?.id,
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return createErrorResponse(error, { context: 'STUDENTS_GET' });
  }
}

export async function POST(req: NextRequest) {
  let userId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    userId = user.id;

    const body = await req.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      grade,
      school,
      medicalNotes,
      emergencyContact,
      emergencyPhone,
      registerForMathCounts,
    } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!dateOfBirth) missingFields.push('dateOfBirth');
    if (!grade) missingFields.push('grade');
    if (!school) missingFields.push('school');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          details: { missing: missingFields },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Create new student
    const student = await studentService.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userId: user.id,
      dateOfBirth,
      grade,
      school,
      medicalNotes,
      emergencyContact,
      emergencyPhone,
    });

    console.log(
      `[STUDENTS_CREATE] Created student ${student.id} for user ${user.id}: ${firstName} ${lastName}`
    );

    // TODO: If registerForMathCounts is true, create a registration for MathCounts program

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    logApiError(error, {
      context: 'STUDENTS_CREATE',
      userId,
      requestPath: req.url,
      requestMethod: 'POST',
      additionalData: {
        hasBody: !!req.body,
      },
    });

    return createErrorResponse(error, { context: 'STUDENTS_CREATE' });
  }
}

export async function DELETE(req: NextRequest) {
  let userId: string | undefined;
  let studentId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    userId = user.id;

    // Get student ID from query params
    const url = new URL(req.url);
    studentId = url.searchParams.get('id');

    if (!studentId) {
      return NextResponse.json(
        {
          error: 'Student ID is required',
          code: 'VALIDATION_ERROR',
          details: { missing: ['id'] },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Verify the student belongs to the current user before deleting
    const student = await studentService.getById(studentId);

    if (!student || student.userId !== user.id) {
      return NextResponse.json(
        {
          error: 'Student not found or unauthorized',
          code: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Delete the student
    await studentService.delete(studentId);

    console.log(`[STUDENTS_DELETE] Deleted student ${studentId} for user ${user.id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'STUDENTS_DELETE',
      userId,
      requestPath: req.url,
      requestMethod: 'DELETE',
      additionalData: {
        studentId: studentId || 'unknown',
      },
    });

    return createErrorResponse(error, { context: 'STUDENTS_DELETE' });
  }
}