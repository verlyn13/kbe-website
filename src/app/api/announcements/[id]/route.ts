import { type NextRequest, NextResponse } from 'next/server';
import { announcementService, profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

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

    // Check if user is admin
    const profile = await profileService.getById(user.id);
    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const announcementId = params.id;
    
    // Delete the announcement
    await announcementService.delete(announcementId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Announcement DELETE API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}