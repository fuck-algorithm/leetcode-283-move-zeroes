// 算法步骤类型
import { getTranslation, formatTranslation } from '../i18n';

export interface AlgorithmStep {
  array: number[];
  slow: number;
  fast: number;
  action: 'init' | 'compare' | 'swap' | 'move' | 'complete';
  swapped?: boolean;
  description?: string;
}

/**
 * 生成移动零算法的步骤
 * @param nums 原始数组
 * @returns 步骤数组
 */
export const generateSteps = (nums: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...nums];
  
  // 初始状态
  steps.push({
    array: [...arr],
    slow: 0,
    fast: 0,
    action: 'init',
    description: formatTranslation('algorithmSteps.init', [])
  });
  
  let slow = 0;
  
  // 交换法实现
  for (let fast = 0; fast < arr.length; fast++) {
    // 比较步骤
    steps.push({
      array: [...arr],
      slow,
      fast,
      action: 'compare',
      description: formatTranslation('algorithmSteps.checking', [fast, arr[fast]])
    });
    
    if (arr[fast] !== 0) {
      // 只有当slow和fast不同且slow位置是0时才有实际交换意义
      const needSwap = slow !== fast && arr[slow] === 0;
      
      if (needSwap) {
        // 交换步骤
        [arr[slow], arr[fast]] = [arr[fast], arr[slow]];
        steps.push({
          array: [...arr],
          slow,
          fast,
          action: 'swap',
          swapped: true,
          description: formatTranslation('algorithmSteps.swap', [arr[slow], slow])
        });
      } else {
        steps.push({
          array: [...arr],
          slow,
          fast,
          action: 'compare',
          description: formatTranslation('algorithmSteps.noSwapNeeded', [slow, arr[slow]])
        });
      }
      
      // 移动慢指针
      slow++;
      steps.push({
        array: [...arr],
        slow,
        fast,
        action: 'move',
        description: formatTranslation('algorithmSteps.advance', [slow])
      });
    } else {
      steps.push({
        array: [...arr],
        slow,
        fast,
        action: 'compare',
        description: formatTranslation('algorithmSteps.skip', [fast])
      });
    }
  }
  
  // 完成状态
  steps.push({
    array: [...arr],
    slow,
    fast: arr.length - 1,
    action: 'complete',
    description: formatTranslation('algorithmSteps.complete', [])
  });
  
  return steps;
}; 