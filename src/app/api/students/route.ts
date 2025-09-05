import { type NextRequest, NextResponse } from 'next/server';
import { studentService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get students for the current user
    const students = await studentService.getByUserId(user.id);
    
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Students GET API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Student name is required' },
        { status: 400 }
      );
    }

    // Create new student
    const student = await studentService.create({
      name: name.trim(),
      userId: user.id,
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Students POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student ID from query params
    const url = new URL(req.url);
    const studentId = url.searchParams.get('id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

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
    console.error('Students DELETE API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}