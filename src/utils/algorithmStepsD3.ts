// D3增强版算法步骤
import { AlgorithmStep } from './algorithmSteps';

// 包含动画状态的增强步骤
export interface AlgorithmStepD3 extends AlgorithmStep {
  // 元素动画状态
  elementStates: {
    [index: number]: {
      highlighted: boolean;
      swapping: boolean;
      comparing: boolean;
      targetPosition?: number; // 用于动画移动
    };
  };
  // 动画阶段（用于复杂转换）
  animationPhase?: 'highlight' | 'compare' | 'swap-start' | 'swap-end' | 'move';
}

/**
 * 生成带有D3动画状态的移动零算法步骤
 * @param nums 原始数组
 * @returns 带有动画状态的步骤数组
 */
export const generateStepsD3 = (nums: number[]): AlgorithmStepD3[] => {
  const steps: AlgorithmStepD3[] = [];
  const arr = [...nums];
  
  // 初始化元素状态
  const createElementStates = (highlights: number[] = []) => {
    const states: AlgorithmStepD3['elementStates'] = {};
    arr.forEach((_, index) => {
      states[index] = {
        highlighted: highlights.includes(index),
        swapping: false,
        comparing: false
      };
    });
    return states;
  };
  
  // 初始状态
  steps.push({
    array: [...arr],
    slow: 0,
    fast: 0,
    action: 'init',
    description: '初始化：快指针和慢指针都指向数组开始位置，准备开始遍历',
    elementStates: createElementStates([0])
  });
  
  let slow = 0;
  
  // 交换法实现
  for (let fast = 0; fast < arr.length; fast++) {
    // 高亮比较元素
    steps.push({
      array: [...arr],
      slow,
      fast,
      action: 'compare',
      description: `检查：快指针(${fast})检查元素${arr[fast]}是否为零`,
      elementStates: createElementStates([slow, fast]),
      animationPhase: 'highlight'
    });
    
    // 比较阶段
    const compareStates = createElementStates([slow, fast]);
    compareStates[fast].comparing = true;
    
    steps.push({
      array: [...arr],
      slow,
      fast,
      action: 'compare',
      description: `比较：快指针(${fast})元素${arr[fast]}${arr[fast] !== 0 ? '不是' : '是'}零`,
      elementStates: compareStates,
      animationPhase: 'compare'
    });
    
    if (arr[fast] !== 0) {
      // 只有当slow和fast不同且slow位置是0时才有实际交换意义
      const needSwap = slow !== fast && arr[slow] === 0;
      
      if (needSwap) {
        // 准备交换
        const swapStartStates = createElementStates([slow, fast]);
        swapStartStates[slow].swapping = true;
        swapStartStates[fast].swapping = true;
        
        steps.push({
          array: [...arr],
          slow,
          fast,
          action: 'swap',
          swapped: false,
          description: `准备交换：位置${slow}的0和位置${fast}的${arr[fast]}`,
          elementStates: swapStartStates,
          animationPhase: 'swap-start'
        });
        
        // 执行交换
        [arr[slow], arr[fast]] = [arr[fast], arr[slow]];
        
        // 交换完成
        const swapEndStates = createElementStates([slow, fast]);
        swapEndStates[slow].highlighted = true;
        
        steps.push({
          array: [...arr],
          slow,
          fast,
          action: 'swap',
          swapped: true,
          description: `交换完成：非零元素${arr[slow]}现在在位置${slow}`,
          elementStates: swapEndStates,
          animationPhase: 'swap-end'
        });
      } else {
        steps.push({
          array: [...arr],
          slow,
          fast,
          action: 'compare',
          description: `无需交换：慢指针(${slow})位置已是非零数${arr[slow]}`,
          elementStates: createElementStates([slow, fast])
        });
      }
      
      // 移动慢指针
      slow++;
      
      // 创建移动状态
      const moveStates = createElementStates([slow]);
      if (slow < arr.length) {
        moveStates[slow - 1].highlighted = true;
      }
      
      steps.push({
        array: [...arr],
        slow,
        fast,
        action: 'move',
        description: `前进：慢指针前进一步到位置${slow}`,
        elementStates: moveStates,
        animationPhase: 'move'
      });
    } else {
      steps.push({
        array: [...arr],
        slow,
        fast,
        action: 'compare',
        description: `跳过：快指针(${fast})发现元素0，慢指针不移动`,
        elementStates: createElementStates([slow, fast])
      });
    }
  }
  
  // 完成状态
  steps.push({
    array: [...arr],
    slow,
    fast: arr.length - 1,
    action: 'complete',
    description: '完成：所有零已移动到数组末尾，非零元素保持原有顺序',
    elementStates: createElementStates()
  });
  
  return steps;
}; 