vi.mock('@/hooks/use-supabase-auth', () => ({
  useSupabaseAuth: () => ({ user: null, loading: false }),
}));

vi.mock('@/hooks/use-admin', () => ({
  useAdmin: () => ({ hasPermission: () => true, admin: { name: 'Admin' } }),
}));

// Mock Prisma-based services layer to avoid DB access and loading state
vi.mock('@/lib/services', () => ({
  registrationService: {
    getStats: vi.fn(async () => ({
      pending: 0,
      active: 0,
      waitlist: 0,
      totalStudents: 0,
    })),
  },
}));

import AdminDashboardPage from '@/app/admin/dashboard/page';
import LoginPage from '@/app/login/page';
import LandingPage from '@/app/page';
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

  it('renders login page with main section', () => {
    render(<LoginPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
