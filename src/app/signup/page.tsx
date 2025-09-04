export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  redirect('/login');
}
