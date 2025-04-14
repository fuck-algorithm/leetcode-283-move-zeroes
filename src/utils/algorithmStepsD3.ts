// D3增强版算法步骤
import { AlgorithmStep } from './algorithmSteps';
import { getTranslation, formatTranslation } from '../i18n';

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
    message: formatTranslation('algorithmSteps.startMovingZeroes', [])
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
        message: formatTranslation('algorithmSteps.checkElement', [array[fast]]),
        phase: 'compare'
      });

      if (slow !== fast) {
        // 准备交换
        const swapPrepElementData = [...newElementData];
        
        // 正确标记要交换的元素 - 使用更明确的标记
        swapPrepElementData.forEach((el, idx) => {
          if (idx === slow || idx === fast) {
            el.state.swapping = true;
            console.log(`标记元素${idx}为交换状态, 值=${el.value}`);
          } else {
            el.state.swapping = false;
          }
        });
        
        steps.push({
          array,
          elementData: swapPrepElementData,
          slow,
          fast,
          action: 'swap',
          message: formatTranslation('algorithmSteps.moveToPosition', [array[fast], slow]),
          phase: 'swap-start'
        });

        // 执行交换
        [array[slow], array[fast]] = [array[fast], array[slow]];
        
        // 创建交换后的元素数据
        const swappedElementData = swapPrepElementData.map(el => ({
          ...el,
          state: { ...el.state, swapping: false }
        }));

        // 更新交换后的元素值，但保持它们的索引不变
        swappedElementData[slow].value = array[slow];
        swappedElementData[slow].isZero = array[slow] === 0;
        
        swappedElementData[fast].value = array[fast];
        swappedElementData[fast].isZero = array[fast] === 0;

        steps.push({
          array: [...array], // 创建数组的副本
          elementData: swappedElementData,
          slow,
          fast,
          action: 'swap',
          message: formatTranslation('algorithmSteps.elementMoved', [array[slow], slow]),
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
      message: formatTranslation('algorithmSteps.movingPointers', []),
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
    message: formatTranslation('algorithmSteps.zeroesMoveComplete', []),
    phase: 'highlight'
  });

  return steps;
}; 