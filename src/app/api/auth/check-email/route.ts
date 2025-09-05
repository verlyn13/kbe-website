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
      console.log('Email check error message:', error.message);
      // Supabase returns "Invalid login credentials" for wrong password on existing user
      // Other messages like "Invalid email" or no specific message for non-existent users
      exists = error.message.toLowerCase().includes('invalid login credentials') || 
               error.message.toLowerCase().includes('invalid password') ||
               error.message.toLowerCase().includes('wrong password') ||
               error.message.toLowerCase().includes('email not confirmed');
    }

    console.log(`Email check for ${email}: exists=${exists}, error=${error?.message}`);
    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Email check error:', error);
    // Fallback: assume email doesn't exist for security
    return NextResponse.json({ exists: false });
  }
}