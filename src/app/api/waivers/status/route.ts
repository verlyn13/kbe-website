import { type NextRequest, NextResponse } from 'next/server';
import { waiverService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const statuses = await waiverService.getStatusesForGuardian(user.id);
    return NextResponse.json({ students: statuses });
  } catch (error) {
    console.error('Waiver status error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
