import { generateSteps } from './stepGenerator';
import { getCodeLineCount } from './codeLineMapper';
import { SUPPORTED_LANGUAGES } from '../types';

describe('generateSteps teaching metadata', () => {
  it('provides semantic operations, narration, and valid code bindings', () => {
    const steps = generateSteps([0, 1, 0, 3, 12]);
    expect(steps.length).toBeGreaterThan(1);
    steps.forEach((step) => {
      expect(step.operation).toBeTruthy();
      expect(step.narration.trim().length).toBeGreaterThan(8);
      expect(step.focusIndices.length).toBeLessThanOrEqual(2);
      SUPPORTED_LANGUAGES.forEach((language) => {
        step.codeLines[language].forEach((line) => {
          expect(line).toBeGreaterThanOrEqual(1);
          expect(line).toBeLessThanOrEqual(getCodeLineCount(language));
        });
      });
    });
  });

  it('preserves the input, keeps the non-zero order, and counts swaps in snapshots', () => {
    const input = [0, 1, 0, 3, 12];
    const steps = generateSteps(input);
    expect(input).toEqual([0, 1, 0, 3, 12]);
    expect(steps[steps.length - 1].array).toEqual([1, 3, 12, 0, 0]);
    expect(steps[steps.length - 1].variables.swapCount).toBe(3);
  });

  it.each([
    [[1, 2, 3], [1, 2, 3]],
    [[0, 0], [0, 0]],
    [[0, 1, 0, 3, 12], [1, 3, 12, 0, 0]],
  ])('produces correct output for %j', (input, output) => {
    const steps = generateSteps(input);
    expect(steps[steps.length - 1].array).toEqual(output);
  });
});
