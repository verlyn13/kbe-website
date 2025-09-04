import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback to safe dummy values during static builds/CI to avoid @supabase/ssr throwing
  const safeUrl = url && url.length > 0 ? url : 'https://example.supabase.co';
  const safeAnon = anon && anon.length > 0 ? anon : 'dummy-anon-key';

  return createBrowserClient<Database>(safeUrl, safeAnon);
}
