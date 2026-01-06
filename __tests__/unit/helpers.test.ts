import { generateId, validateEmail, truncate, sanitizeInput } from '@/lib/utils/helpers';

describe('Helper Functions', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
  });

  it('should validate emails correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('should truncate strings', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
    expect(truncate('short', 10)).toBe('short');
  });

  it('should sanitize input', () => {
    const dirty = '<script>alert("xss")</script>';
    const clean = sanitizeInput(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('&lt;');
  });
});
