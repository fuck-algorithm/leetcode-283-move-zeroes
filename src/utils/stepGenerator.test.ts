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

  it('explains pointer roles and array changes in beginner-friendly language', () => {
    const steps = generateSteps([0, 1, 0]);
    expect(steps[0].description).toContain('slow');
    expect(steps[0].description).toContain('fast');
    expect(steps.find(step => step.action === 'compare' && step.fastPointer === 0)?.detailDescription)
      .toContain('0');
    expect(steps.find(step => step.action === 'swap_execute')?.detailDescription)
      .toContain('原来是 0');
    expect(steps.find(step => step.action === 'move_slow')?.detailDescription)
      .toContain('按原顺序放好');
    expect(steps.find(step => step.action === 'move_slow' && step.fastPointer === 1)?.description)
      .toContain('fast 找到的 1 已放到前面');
    expect(steps.find(step => step.action === 'compare' && step.fastPointer === 0)?.detailDescription)
      .toContain('先留在原格');
    expect(steps.find(step => step.action === 'compare' && step.fastPointer === 1)?.detailDescription)
      .toContain('第 1 格是前面 0 留下的空格');

    const noSwapSteps = generateSteps([1, 2, 3]);
    const alreadyPlaced = noSwapSteps.find(step => step.action === 'compare');
    expect(alreadyPlaced?.detailDescription).toContain('不用挪动');
    expect(alreadyPlaced?.detailDescription).toContain('第 1 格');
    expect(noSwapSteps.find(step => step.action === 'move_slow')?.description)
      .toContain('fast 找到的 1 已放到前面');
    expect(steps[steps.length - 1].detailDescription).not.toContain('时间复杂度');
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
