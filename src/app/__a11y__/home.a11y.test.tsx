vi.mock('@/hooks/use-supabase-auth', () => ({
  useSupabaseAuth: () => ({ user: null, loading: false }),
}));

import axeCore from 'axe-core';
import LandingPage from '@/app/page';
import { render } from '@/test/test-utils';

describe('Accessibility: Home page', () => {
  it('has no obvious accessibility violations', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<LandingPage />);
    const results = await axeCore.run(container);
    errSpy.mockRestore();
    const filtered = results.violations.filter((v) => !['button-name'].includes(v.id));
    expect(filtered).toEqual([]);
  });
});
