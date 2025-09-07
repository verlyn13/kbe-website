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

    // Get program ID from query params
    const url = new URL(req.url);
    const programId = url.searchParams.get('programId') || 'mathcounts-2025';

    // Get registration stats
    const stats = await registrationService.getStats(programId);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}