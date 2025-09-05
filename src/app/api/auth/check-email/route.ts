import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Attempt sign-in with invalid password to check if email exists
    // Supabase returns different error codes for:
    // - "Invalid login credentials" = user exists but wrong password
    // - "Invalid email" = user doesn't exist
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: '___impossible_password_check___',
    });

    let exists = false;
    
    if (error) {
      // "Invalid login credentials" means email exists
      // "Invalid email" or similar means email doesn't exist
      exists = error.message.includes('Invalid login credentials') || 
               error.message.includes('Invalid password') ||
               error.message.includes('Wrong password');
    }

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Email check error:', error);
    // Fallback: assume email doesn't exist for security
    return NextResponse.json({ exists: false });
  }
}