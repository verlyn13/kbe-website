import { type NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/lib/services';
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

    const profile = await profileService.getById(user.id);
    
    if (!profile) {
      // User exists in auth but not in database - this is fine for new users
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Profile GET API error:', error);
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
    const { name, phone, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Update or create the profile using upsert
    const profile = await profileService.upsert({
      id: user.id,
      email: email,
      name: name,
      phone: phone ? phone.replace(/\D/g, '') : undefined, // Strip non-digits from phone
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Profile POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
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

    const body = await req.json();
    const { name, phone } = body;

    // Update existing profile
    const profile = await profileService.update(user.id, {
      name,
      phone: phone ? phone.replace(/\D/g, '') : undefined,
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Profile PUT API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}