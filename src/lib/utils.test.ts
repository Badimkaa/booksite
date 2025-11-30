
import { cn, formatDate } from './utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('bg-red-500', { 'text-white': true })).toBe('bg-red-500 text-white');
    expect(cn('bg-red-500', { 'text-white': false })).toBe('bg-red-500');
  });

  it('should merge conflicting tailwind classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});

describe('formatDate', () => {
  it('should format the date correctly', () => {
    const date = '2023-10-27T10:00:00.000Z';
    expect(formatDate(date)).toBe('27.10.2023');
  });

  it('should handle a Date object', () => {
    const date = new Date('2023-10-27T10:00:00.000Z');
    expect(formatDate(date)).toBe('27.10.2023');
  });
});
