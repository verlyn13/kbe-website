'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminCalendarPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main calendar page - admins will see edit controls there
    router.push('/calendar');
  }, [router]);

  return null;
}
