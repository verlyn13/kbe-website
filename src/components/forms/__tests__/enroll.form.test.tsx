import React from 'react';
import { render, screen, fireEvent } from '@/test/test-utils';
import { waitFor } from '@testing-library/react';
import { ParentAccountForm } from '@/components/registration/parent-account';

describe('Enrollment form contract', () => {
  it('submits minimal valid parent account data', async () => {
    const onSubmit = vi.fn();

    render(<ParentAccountForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '555-555-5555' } });
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { target: { value: '12345' } });

    fireEvent.click(screen.getByRole('button', { name: /continue to add students/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toMatchObject({
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-555-5555',
      zipCode: '12345',
    });
  });
});
