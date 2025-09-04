import { type NextRequest, NextResponse } from 'next/server';
import { waiverService } from '@/lib/services/waiver-service';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    // TODO: enforce admin auth using Supabase and role claims
    const data = await waiverService.getAllStatuses();
    return NextResponse.json({ students: data });
  } catch (error) {
    console.error('Admin waiver list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
