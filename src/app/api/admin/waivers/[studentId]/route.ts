import { type NextRequest, NextResponse } from 'next/server';
import { waiverService } from '@/lib/services';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, context: { params: Promise<{ studentId: string }> }) {
  try {
    const params = await context.params;
    // TODO: enforce admin auth using Supabase and role claims
    const body = (await req.json()) as { status: 'pending' | 'received' | 'rejected' };
    if (!body?.status) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    const updated = await waiverService.setStatus(params.studentId, body.status);
    return NextResponse.json({ student: updated });
  } catch (error) {
    console.error('Admin waiver update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
