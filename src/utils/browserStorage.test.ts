import { getStoredValue, setStoredValue } from './browserStorage';

describe('browserStorage', () => {
  it('reads and writes values when localStorage is available', () => {
    expect(setStoredValue('preference', 'zh')).toBe(true);
    expect(getStoredValue('preference')).toBe('zh');
  });

  it('returns safe defaults when localStorage access throws', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    try {
      Object.defineProperty(window, 'localStorage', {
      configurable: true,
        get: () => { throw new DOMException('Blocked', 'SecurityError'); },
      });

      expect(getStoredValue('preference')).toBeNull();
      expect(setStoredValue('preference', 'en')).toBe(false);
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(window, 'localStorage', originalDescriptor);
      } else {
        Reflect.deleteProperty(window, 'localStorage');
      }
    }
  });
});
