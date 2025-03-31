// 算法步骤类型
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
    description: '初始化：快指针和慢指针都指向数组开始位置，准备开始遍历'
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
      description: `检查：快指针(${fast})检查元素${arr[fast]}是否为零`
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
          description: `交换：找到非零元素${arr[slow]}，与位置${slow}的0进行交换`
        });
      } else {
        steps.push({
          array: [...arr],
          slow,
          fast,
          action: 'compare',
          description: `无需交换：慢指针(${slow})位置已是非零数${arr[slow]}`
        });
      }
      
      // 移动慢指针
      slow++;
      steps.push({
        array: [...arr],
        slow,
        fast,
        action: 'move',
        description: `前进：慢指针前进一步到位置${slow}`
      });
    } else {
      steps.push({
        array: [...arr],
        slow,
        fast,
        action: 'compare',
        description: `跳过：快指针(${fast})发现元素0，慢指针不移动`
      });
    }
  }
  
  // 完成状态
  steps.push({
    array: [...arr],
    slow,
    fast: arr.length - 1,
    action: 'complete',
    description: '完成：所有零已移动到数组末尾，非零元素保持原有顺序'
  });
  
  return steps;
}; 