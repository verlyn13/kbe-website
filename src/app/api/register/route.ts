import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { profileService, registrationService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parent, students, program } = body;

    // Registration API uses Supabase auth
    const USE_SUPABASE_AUTH = process.env.NEXT_PUBLIC_USE_SUPABASE_AUTH === 'true';

    if (!USE_SUPABASE_AUTH) {
      return NextResponse.json(
        { error: 'Registration through this API requires Supabase auth to be enabled' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parent.email,
      password: parent.password,
      options: {
        data: {
          full_name: parent.fullName,
        },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    const user = authData.user; // TypeScript assertion after null check

    // Create user profile
    await profileService.upsert({
      id: user.id,
      email: parent.email,
      name: parent.fullName,
      phone: parent.phone,
      role: 'GUARDIAN',
    });

    // Create students
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

    const createdStudents = await Promise.all(studentPromises);

    // Create registrations for each student
    const registrationPromises = createdStudents.map((student) =>
      registrationService.create({
        userId: user.id,
        studentId: student.id,
        programId: program.id,
        status: 'PENDING',
      })
    );

    await Promise.all(registrationPromises);

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to complete registration' }, { status: 500 });
  }
}
