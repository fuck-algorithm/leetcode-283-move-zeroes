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
    description:
      '先认识两个位置标记：slow 负责指出数字要放哪一格，fast 负责从左往右检查数字。',
    detailDescription:
      'slow（放置位置）从第 1 格开始；fast（查找位置）接下来从左往右逐格检查。代码里的 slow = 0 表示第 1 格，因为代码从 0 开始编号。',
    codeLines: getCodeLineBinding('init'),
    variables: { slow, fast: -1, nums: [...nums], swapCount },
    annotations: [{
      type: 'label',
      text: 'slow 左边：按原顺序放好的非零数字',
      position: 'top',
    }],
    highlightIndices: [0],
  });

  for (let fast = 0; fast < nums.length; fast += 1) {
    const value = nums[fast];
    addStep({
      array: [...nums],
      slowPointer: slow,
      fastPointer: fast,
      action: 'compare',
      description: `查找位置 fast 正在检查第 ${fast + 1} 格的数字 ${value}。`,
      detailDescription: value === 0
        ? 'fast 当前看到 0：它不能放进非零结果；先留在原格，继续往右找。'
        : slow === fast
          ? `fast 找到非零数字 ${value}。前面没有 0 留下的空格，它本来就在第 ${slow + 1} 格，所以不用挪动。`
          : `fast 找到非零数字 ${value}。第 ${slow + 1} 格是前面 0 留下的空格，把 ${value} 放进去；被换到后面的 0 最后会排在末尾。`,
      codeLines: getCodeLineBinding('compare'),
      variables: { slow, fast, nums: [...nums], swapCount },
      annotations: [{
        type: 'comparison',
        fromIndex: fast,
        text: value === 0 ? '是 0，跳过' : `不是 0，保留 ${value}`,
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
          description: `把数字 ${value} 从第 ${fast + 1} 格移到前面的空格（第 ${slow + 1} 格）。`,
          detailDescription:
            `第 ${slow + 1} 格原来是 ${displaced}，现在放入 ${value}；原来的 0 被换到后面，其他数字顺序不变。`,
          codeLines: getCodeLineBinding('swap'),
          variables: { slow, fast, nums: [...nums], swapCount },
          annotations: [{
            type: 'arrow',
            fromIndex: fast,
            toIndex: slow,
            text: `把 ${value} 放进空格`,
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
        description: `fast 找到的 ${value} 已放到前面。slow 右移到第 ${slow + 1} 格，准备放下一个非零数字。`,
        detailDescription:
          'slow 是下一个可以放非零数字的位置；它左边的数字已按原顺序放好。',
        codeLines: getCodeLineBinding('move_slow'),
        variables: { slow, fast, nums: [...nums], swapCount },
        annotations: [{
          type: 'region',
          fromIndex: 0,
          toIndex: Math.max(0, slow - 1),
          text: '按原顺序放好的非零数字',
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
    description: `所有数字都检查完了：${slow} 个非零数字留在前面，${nums.length - slow} 个 0 排在末尾。`,
    detailDescription: '每个数字只需检查一次，直接在原数组里调整，没有另外复制一份数组。',
    codeLines: getCodeLineBinding('complete'),
    variables: { slow, fast: nums.length - 1, nums: [...nums], swapCount },
    annotations: [
      {
        type: 'region',
        fromIndex: 0,
        toIndex: Math.max(0, slow - 1),
        text: '按原顺序放好的非零数字',
        color: '#b9e0cf',
      },
      {
        type: 'label',
        text: `结果：${nums.length - slow} 个 0 移到末尾 · ${swapCount} 次换位`,
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
