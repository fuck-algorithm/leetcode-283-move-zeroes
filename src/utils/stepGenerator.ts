/* Snapshot generation for the Move Zeroes two-pointer algorithm. */
import {
  AlgorithmStep,
  StepAction,
  CodeLineBinding,
  VariableSnapshot,
  AnnotationConfig,
} from '../types';
import { getCodeLineBinding } from './codeLineMapper';

interface StepParams {
  id: number;
  array: number[];
  slowPointer: number;
  fastPointer: number;
  action: StepAction;
  description: string;
  detailDescription?: string;
  codeLines: CodeLineBinding;
  variables: VariableSnapshot;
  animation?: AlgorithmStep['animation'];
  annotations?: AnnotationConfig[];
  highlightIndices?: number[];
}

export function generateSteps(inputArray: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nums = [...inputArray];
  let slow = 0;
  let swapCount = 0;

  const addStep = (params: Omit<StepParams, 'id'>) => {
    steps.push(createStep({ ...params, id: steps.length }));
  };

  addStep({
    array: [...nums],
    slowPointer: 0,
    fastPointer: -1,
    action: 'init_slow',
    description: '慢指针从数组开头开始，标记下一个非零元素的目标位置。',
    detailDescription: 'slow = 0；所有数组槽位保持原位。',
    codeLines: getCodeLineBinding('init'),
    variables: { slow, fast: -1, nums: [...nums], swapCount },
    annotations: [{ type: 'label', text: '写入位置从索引 0 开始', position: 'top' }],
    highlightIndices: [0],
  });

  for (let fast = 0; fast < nums.length; fast += 1) {
    const value = nums[fast];
    addStep({
      array: [...nums],
      slowPointer: slow,
      fastPointer: fast,
      action: 'compare',
      description: `检查 nums[${fast}] = ${value}，判断快指针遇到的是零还是需要保留的元素。`,
      detailDescription: value === 0
        ? '当前是零，slow 保持不动，让后续非零元素覆盖这个位置。'
        : '当前值非零，必须按原有顺序写入 slow 指向的位置。',
      codeLines: getCodeLineBinding('compare'),
      variables: { slow, fast, nums: [...nums], swapCount },
      annotations: [{
        type: 'comparison',
        fromIndex: fast,
        text: `${value} ${value === 0 ? '= 0' : '≠ 0'}`,
      }],
      highlightIndices: [fast],
    });

    if (value !== 0) {
      if (slow !== fast) {
        const displaced = nums[slow];
        [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
        swapCount += 1;
        addStep({
          array: [...nums],
          slowPointer: slow,
          fastPointer: fast,
          action: 'swap_execute',
          description: `将非零值 ${value} 写入索引 ${slow}，把零移到索引 ${fast}。`,
          detailDescription:
            `交换 nums[${slow}] = ${displaced} 与 nums[${fast}] = ${value}，非零元素顺序不变。`,
          codeLines: getCodeLineBinding('swap'),
          variables: { slow, fast, nums: [...nums], swapCount },
          annotations: [{
            type: 'arrow',
            fromIndex: fast,
            toIndex: slow,
            text: `写入 ${value}`,
          }],
          highlightIndices: [slow, fast],
          animation: {
            type: 'swap',
            fromIndex: fast,
            toIndex: slow,
            duration: 360,
            easing: 'ease-in-out',
          },
        });
      }

      slow += 1;
      addStep({
        array: [...nums],
        slowPointer: slow,
        fastPointer: fast,
        action: 'move_slow',
        description: `索引 ${fast} 的非零值已安置，slow 前进到 ${slow} 作为下一个写入位置。`,
        detailDescription:
          `前缀 [0, ${slow}) 已按原顺序收集全部已扫描的非零元素。`,
        codeLines: getCodeLineBinding('move_slow'),
        variables: { slow, fast, nums: [...nums], swapCount },
        annotations: [{
          type: 'region',
          fromIndex: 0,
          toIndex: Math.max(0, slow - 1),
          text: '已保留的非零前缀',
          color: '#b9e0cf',
        }],
        highlightIndices: slow < nums.length ? [slow] : [fast],
        animation: { type: 'move', fromIndex: slow - 1, toIndex: slow, duration: 300 },
      });
    }
  }

  addStep({
    array: [...nums],
    slowPointer: slow,
    fastPointer: nums.length - 1,
    action: 'complete',
    description: `遍历结束：${slow} 个非零元素保持原顺序，${nums.length - slow} 个零位于数组末尾。`,
    detailDescription: `原地完成，共交换 ${swapCount} 次；时间复杂度 O(n)，额外空间 O(1)。`,
    codeLines: getCodeLineBinding('complete'),
    variables: { slow, fast: nums.length - 1, nums: [...nums], swapCount },
    annotations: [
      {
        type: 'region',
        fromIndex: 0,
        toIndex: Math.max(0, slow - 1),
        text: '非零元素',
        color: '#b9e0cf',
      },
      {
        type: 'label',
        text: `零元素位于末尾 · ${swapCount} 次交换`,
        position: 'bottom',
      },
    ],
    highlightIndices: [Math.max(0, slow - 1)],
  });

  return steps;
}

function createStep(params: StepParams): AlgorithmStep {
  const operationByAction: Record<StepAction, AlgorithmStep['operation']> = {
    init: 'init',
    init_slow: 'init',
    init_fast: 'init',
    compare: 'compare',
    compare_zero: 'read',
    compare_nonzero: 'read',
    swap_prepare: 'swap',
    swap_execute: 'swap',
    swap_complete: 'swap',
    swap: 'read',
    move_slow: 'move',
    move_fast: 'move',
    complete: 'done',
  };

  return {
    ...params,
    operation: operationByAction[params.action],
    narration: params.detailDescription || params.description,
    focusIndices: (params.highlightIndices || []).slice(0, 2),
  };
}

export function getStepShortDescription(step: AlgorithmStep): string {
  switch (step.action) {
    case 'init':
    case 'init_slow':
    case 'init_fast': return '初始化';
    case 'compare':
    case 'compare_zero':
    case 'compare_nonzero': return `检查 [${step.fastPointer}]`;
    case 'swap_prepare': return '准备交换';
    case 'swap_execute':
    case 'swap': return `交换 [${step.slowPointer}] ↔ [${step.fastPointer}]`;
    case 'swap_complete': return '交换完成';
    case 'move_slow': return `slow → ${step.slowPointer}`;
    case 'move_fast': return `fast → ${step.fastPointer}`;
    case 'complete': return '完成';
    default: return '';
  }
}

export function getActionName(action: StepAction): string {
  const names: Record<StepAction, string> = {
    init: '初始化',
    init_slow: '初始化慢指针',
    init_fast: '初始化快指针',
    compare: '比较',
    compare_zero: '发现零',
    compare_nonzero: '发现非零',
    swap_prepare: '准备交换',
    swap_execute: '执行交换',
    swap_complete: '交换完成',
    swap: '交换',
    move_slow: '移动慢指针',
    move_fast: '移动快指针',
    complete: '完成',
  };
  return names[action] || action;
}

export function getActionColor(action: StepAction): string {
  switch (action) {
    case 'init':
    case 'init_slow':
    case 'init_fast': return '#247d61';
    case 'compare':
    case 'compare_zero':
    case 'compare_nonzero': return '#b37b19';
    case 'swap_prepare':
    case 'swap_execute':
    case 'swap': return '#bc6542';
    case 'swap_complete':
    case 'move_slow':
    case 'move_fast':
    case 'complete': return '#247d61';
    default: return '#60756d';
  }
}

export default { generateSteps, getStepShortDescription, getActionName, getActionColor };
