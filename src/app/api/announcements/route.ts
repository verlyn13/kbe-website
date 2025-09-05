import { NextResponse } from 'next/server';
import { announcementService } from '@/lib/services';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const announcements = await announcementService.getAll();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}