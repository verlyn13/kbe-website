import { type NextRequest, NextResponse } from 'next/server';
import { profileService, registrationService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const profile = await profileService.getById(user.id);
    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all registrations
    const registrations = await registrationService.getAll();

    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error('Admin registrations API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const profile = await profileService.getById(user.id);
    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update registration status
    const updated = await registrationService.updateStatus(id, status);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Admin registration update error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}