vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

vi.mock('@/hooks/use-admin', () => ({
  useAdmin: () => ({ hasPermission: () => true, admin: { name: 'Admin' } }),
}));

vi.mock('@/lib/firebase-admin', () => ({
  registrationService: {
    getStats: vi.fn(async () => ({ pending: 0, active: 0, waitlist: 0, totalStudents: 0 })),
  },
}));

import AdminDashboardPage from '@/app/admin/dashboard/page';
import LandingPage from '@/app/page';
import RegisterPage from '@/app/register/page';
import { render, screen } from '@/test/test-utils';

describe('Smoke: critical routes render', () => {
  it('renders home page without errors and shows headline', () => {
    render(<LandingPage />);
    // main landmark exists
    expect(screen.getByRole('main')).toBeInTheDocument();
    // unique heading
    expect(screen.getByText(/Welcome to Homer Enrichment Hub/i)).toBeInTheDocument();
  });

  it('renders admin dashboard headline', async () => {
    render(<AdminDashboardPage />);
    expect(await screen.findByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('renders register page with main section', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
