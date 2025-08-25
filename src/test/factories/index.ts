// Simple test data factories (no libs)

export function makeUser(overrides: Partial<{ id: string; email: string; name: string }> = {}) {
  return {
    id: overrides.id ?? 'user_123',
    email: overrides.email ?? 'user@example.com',
    name: overrides.name ?? 'Test User',
  };
}

export function makeRegistration(overrides: Partial<any> = {}) {
  return {
    id: overrides.id ?? 'reg_123',
    parentId: overrides.parentId ?? 'user_123',
    parentName: overrides.parentName ?? 'Parent Name',
    parentEmail: overrides.parentEmail ?? 'parent@example.com',
    parentPhone: overrides.parentPhone ?? '5551234567',
    students: overrides.students ?? [
      { firstName: 'Alice', lastName: 'A', grade: '6', school: 'HMS' },
    ],
    programId: overrides.programId ?? 'mathcounts-2025',
    status: overrides.status ?? 'pending',
    paymentStatus: overrides.paymentStatus ?? 'pending',
    registrationDate: overrides.registrationDate ?? new Date(),
  };
}

export function makeEmailPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    firstName: 'Test',
    magicLinkUrl: 'https://example.com/magic',
    ...overrides,
  };
}
