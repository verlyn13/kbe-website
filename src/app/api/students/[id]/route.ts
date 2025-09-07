import { type NextRequest, NextResponse } from 'next/server';
import { studentService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = params.id;
    
    // Get the student
    const student = await studentService.getById(studentId);
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Verify the student belongs to the current user
    if (student.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error('Student GET API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = params.id;
    const body = await req.json();
    const { name, grade, school, dateOfBirth, medicalNotes } = body;

    // Validate required fields
    if (!name || !grade || !school || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Required fields: name, grade, school, dateOfBirth' },
        { status: 400 }
      );
    }

    // Get the student to verify ownership
    const existingStudent = await studentService.getById(studentId);
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Verify the student belongs to the current user
    if (existingStudent.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error('Student PUT API error:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = params.id;

    // Verify the student belongs to the current user before deleting
    const student = await studentService.getById(studentId);
    
    if (!student || student.userId !== user.id) {
      return NextResponse.json(
        { error: 'Student not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the student
    await studentService.delete(studentId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Student DELETE API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}