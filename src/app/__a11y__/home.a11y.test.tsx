import React from 'react';
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

import { render } from '@/test/test-utils';
import LandingPage from '@/app/page';
import axeCore from 'axe-core';

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
