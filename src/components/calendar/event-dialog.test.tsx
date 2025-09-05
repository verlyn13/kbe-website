import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { EventDialog } from './event-dialog';

vi.mock('@/hooks/use-supabase-auth', () => ({
  useSupabaseAuth: () => ({ user: { id: 'user-1' }, loading: false }),
}));

vi.mock('@/lib/services', () => ({
  calendarService: {
    create: vi.fn(async () => ({})),
    update: vi.fn(async () => ({})),
  },
}));

describe('EventDialog', () => {
  it('renders default start/end time labels', () => {
    render(
      <EventDialog open onOpenChange={() => {}} initialDate={new Date('2025-01-01T09:00:00')} />
    );

    // Defaults are 09:00 -> 10:00
    expect(screen.getByTestId('start-time')).toHaveTextContent(/9:00\s?AM/i);
    expect(screen.getByTestId('end-time')).toHaveTextContent(/10:00\s?AM/i);
  });

  it('renders provided event start/end times', () => {
    const start = new Date('2025-01-01T13:30:00');
    const end = new Date('2025-01-01T14:30:00');
    render(
      <EventDialog
        open
        onOpenChange={() => {}}
        event={{
          id: '1',
          title: 'Test',
          description: 'Desc',
          start,
          end,
          category: 'class',
          type: 'event',
        }}
      />
    );
    expect(screen.getByTestId('start-time')).toHaveTextContent(/1:30\s?PM/i);
    expect(screen.getByTestId('end-time')).toHaveTextContent(/2:30\s?PM/i);
  });
});
