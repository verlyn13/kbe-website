import { describe, expect, it } from 'vitest';
import { plusOneHour } from './time-utils';

describe('plusOneHour', () => {
  it('adds one hour for a full hour slot', () => {
    expect(plusOneHour('09:00')).toBe('10:00');
  });

  it('adds one hour for a half-hour slot', () => {
    expect(plusOneHour('12:30')).toBe('13:30');
  });

  it('caps at the last slot', () => {
    expect(plusOneHour('23:30')).toBe('23:30');
  });

  it('passes through unknown values unchanged', () => {
    expect(plusOneHour('invalid')).toBe('invalid');
  });
});
