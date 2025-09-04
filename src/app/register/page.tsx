import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function RegisterPage() {
  // Canonicalize legacy /register to unified auth entry
  redirect('/login');
}
