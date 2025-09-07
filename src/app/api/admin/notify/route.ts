import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

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
    
    // Log the notification for now
    // In production, this would send an email, create a notification record, etc.
    console.log('Admin notification:', {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userEmail: user.email,
      ...body,
    });

    // TODO: Implement actual notification system
    // Options:
    // 1. Send email to admin
    // 2. Create notification record in database
    // 3. Send to webhook/Slack/Discord
    // 4. Add to admin dashboard notification feed

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin notification error:', error);
    // Don't fail the main operation if notification fails
    return NextResponse.json({ success: false }, { status: 200 });
  }
}