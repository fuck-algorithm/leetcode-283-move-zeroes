// D3增强版算法步骤
import { AlgorithmStep } from './algorithmSteps';

export interface ElementState {
  highlighted: boolean;
  comparing: boolean;
  swapping: boolean;
}

export interface ElementData {
  value: number;
  index: number;
  isZero: boolean;
  state: ElementState;
  x?: number;
}

export interface AlgorithmStepD3 extends AlgorithmStep {
  elementData: ElementData[];
  phase?: string;
  message?: string;
}

/**
 * 将普通数组转换为带有状态的数组元素
 */
const createElementData = (value: number, index: number): ElementData => ({
  value,
  index,
  isZero: value === 0,
  state: {
    highlighted: false,
    comparing: false,
    swapping: false
  }
});

/**
 * 生成带有D3状态的算法步骤
 */
export const generateAlgorithmStepsD3 = (initialArray: number[]): AlgorithmStepD3[] => {
  const steps: AlgorithmStepD3[] = [];
  const array = [...initialArray];
  let slow = 0;
  let fast = 0;

  // 初始状态
  steps.push({
    array: array,
    elementData: array.map((value, index) => createElementData(value, index)),
    slow,
    fast,
    action: 'init',
    message: '开始移动零元素'
  });

  // 遍历数组
  while (fast < array.length) {
    const currentStep = steps[steps.length - 1];
    const newElementData = currentStep.elementData.map(el => ({
      ...el,
      state: { ...el.state, highlighted: false, comparing: false, swapping: false }
    }));

    // 比较阶段
    if (array[fast] !== 0) {
      // 高亮当前比较的元素
      newElementData[fast].state.comparing = true;
      steps.push({
        array,
        elementData: newElementData,
        slow,
        fast,
        action: 'compare',
        message: `检查元素 ${array[fast]}`,
        phase: 'compare'
      });

      if (slow !== fast) {
        // 准备交换
        newElementData[slow].state.swapping = true;
        newElementData[fast].state.swapping = true;
        steps.push({
          array,
          elementData: newElementData,
          slow,
          fast,
          action: 'swap',
          message: `将 ${array[fast]} 移动到位置 ${slow}`,
          phase: 'swap-start'
        });

        // 执行交换
        [array[slow], array[fast]] = [array[fast], array[slow]];
        const swappedElementData = newElementData.map(el => ({
          ...el,
          state: { ...el.state, swapping: false }
        }));

        // 修复交换逻辑 - 正确交换元素数据
        // 保存交换前的值以便正确更新
        const slowValue = array[slow];
        const fastValue = array[fast];

        // 直接交换这两个元素的完整数据
        const tempElementData = { ...swappedElementData[slow] };
        swappedElementData[slow] = { 
          ...swappedElementData[fast], 
          value: slowValue,  // 使用正确的交换后的值
          isZero: slowValue === 0,
          index: slow  // 保持原始索引不变
        };
        swappedElementData[fast] = { 
          ...tempElementData, 
          value: fastValue,  // 使用正确的交换后的值
          isZero: fastValue === 0,
          index: fast  // 保持原始索引不变
        };

        steps.push({
          array: [...array], // 创建数组的副本
          elementData: swappedElementData,
          slow,
          fast,
          action: 'swap',
          message: `${array[slow]} 已移动到位置 ${slow}`,
          phase: 'swap-end' // 更改为'swap-end'以区分
        });
      }
      slow++;
    }
    fast++;

    // 移动指针
    steps.push({
      array: [...array],
      elementData: array.map((value, index) => ({
        value,
        index,
        isZero: value === 0,
        state: { 
          highlighted: false, 
          comparing: false, 
          swapping: false 
        }
      })),
      slow,
      fast,
      action: 'move',
      message: '移动指针',
      phase: 'move'
    });
  }

  // 完成状态
  const finalElementData = array.map((value, index) => ({
    value,
    index,
    isZero: value === 0,
    state: { highlighted: true, comparing: false, swapping: false }
  }));

  steps.push({
    array: [...array],
    elementData: finalElementData,
    slow,
    fast,
    action: 'complete',
    message: '完成移动零元素',
    phase: 'highlight'
  });

  return steps;
}; 