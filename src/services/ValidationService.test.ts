import { DEFAULT_VALIDATION_RULES } from '../types';
import { generateRandomArray, parseInput, validateArray, validateInput } from './ValidationService';

describe('ValidationService', () => {
  it('accepts arrays at the lower and upper display limits', () => {
    expect(validateInput('0').isValid).toBe(true);
    expect(validateInput(Array.from({ length: 20 }, (_, index) => index).join(',')).isValid).toBe(true);
    expect(validateArray([1], DEFAULT_VALIDATION_RULES).isValid).toBe(true);
  });

  it('rejects arrays beyond the display limit before generating steps', () => {
    const tooLong = Array.from({ length: 21 }, () => '1').join(',');
    expect(validateInput(tooLong)).toMatchObject({ isValid: false, error: '数组长度不能超过20' });
  });

  it('accepts signed 32-bit boundaries and rejects values outside them', () => {
    expect(validateInput('-2147483648,2147483647').isValid).toBe(true);
    expect(validateInput('-2147483649').isValid).toBe(false);
    expect(validateInput('2147483648').isValid).toBe(false);
  });

  it.each(['', '[]', '1,,2', ',1', '1,', '1,abc', '[1,2', '1,2]'])('rejects malformed input %j', (input) => {
    expect(parseInput(input).isValid).toBe(false);
  });

  it('accepts comma and whitespace separated integer input', () => {
    expect(validateInput(' [ -1, 0, 2 ] ').sanitizedValue).toEqual([-1, 0, 2]);
    expect(validateInput('-1 0 2').sanitizedValue).toEqual([-1, 0, 2]);
  });

  it('generates valid random arrays within the UI limit and always includes zero', () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const values = generateRandomArray();
      expect(values.length).toBeGreaterThanOrEqual(1);
      expect(values.length).toBeLessThanOrEqual(20);
      expect(values).toContain(0);
      expect(values.every((value) => Number.isInteger(value) && value >= -100 && value <= 100)).toBe(true);
      expect(validateArray(values).isValid).toBe(true);
    }
  });
});
