import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { studentService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string | undefined;
  const { id: studentId } = await params;

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

    // Get the student
    const student = await studentService.getById(studentId);

    if (!student) {
      return NextResponse.json(
        {
          error: 'Student not found',
          code: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Verify the student belongs to the current user
    if (student.userId !== user.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    console.log(`[STUDENT_GET] Retrieved student ${studentId} for user ${user.id}`);

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'STUDENT_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
      additionalData: {
        studentId,
      },
    });

    return createErrorResponse(error, { context: 'STUDENT_GET' });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string | undefined;
  const { id: studentId } = await params;

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
    const { name, grade, school, dateOfBirth, medicalNotes } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!name) missingFields.push('name');
    if (!grade) missingFields.push('grade');
    if (!school) missingFields.push('school');
    if (!dateOfBirth) missingFields.push('dateOfBirth');

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

    // Get the student to verify ownership
    const existingStudent = await studentService.getById(studentId);

    if (!existingStudent) {
      return NextResponse.json(
        {
          error: 'Student not found',
          code: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Verify the student belongs to the current user
    if (existingStudent.userId !== user.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Update the student
    const updatedStudent = await studentService.update(studentId, {
      name: name.trim(),
      dateOfBirth: new Date(dateOfBirth),
      grade: grade.toString(),
      school,
      medicalNotes,
    });

    console.log(`[STUDENT_UPDATE] Updated student ${studentId} for user ${user.id}`);

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'STUDENT_UPDATE',
      userId,
      requestPath: req.url,
      requestMethod: 'PUT',
      additionalData: {
        studentId,
      },
    });

    return createErrorResponse(error, { context: 'STUDENT_UPDATE' });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string | undefined;
  const { id: studentId } = await params;

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

    console.log(`[STUDENT_DELETE] Deleted student ${studentId} for user ${user.id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'STUDENT_DELETE',
      userId,
      requestPath: req.url,
      requestMethod: 'DELETE',
      additionalData: {
        studentId,
      },
    });

    return createErrorResponse(error, { context: 'STUDENT_DELETE' });
  }
}
