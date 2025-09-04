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

    const isComplete = await profileService.isProfileComplete(user.id);
    return NextResponse.json({ complete: isComplete }, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Profile status API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
