
import { formatDate } from './utils';

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
