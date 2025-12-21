/**
 * 算法步骤生成器
 * 为 "移动零" 算法生成详细的分步执行步骤
 * 包含更细粒度的步骤划分和丰富的标注信息
 */

import { AlgorithmStep, StepAction, CodeLineBinding, VariableSnapshot, AnnotationConfig } from '../types';
import { getCodeLineBinding } from './codeLineMapper';

/**
 * 生成移动零算法的所有执行步骤（增强版）
 * @param inputArray 输入数组
 * @returns 算法步骤数组
 */
export function generateSteps(inputArray: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepId = 0;

  // 复制数组，避免修改原数组
  const nums = [...inputArray];
  let slow = 0;
  let swapCount = 0;

  // ========== 步骤1：初始化阶段 ==========
  // 1.1 初始化慢指针
  steps.push(createStep({
    id: stepId++,
    array: [...nums],
    slowPointer: 0,
    fastPointer: -1,  // fast还未初始化
    action: 'init_slow',
    description: '初始化慢指针 slow = 0',
    detailDescription: '慢指针 slow 指向数组开头，用于标记下一个非零元素应该放置的位置',
    codeLines: getCodeLineBinding('init'),
    variables: { slow: 0, fast: -1, nums: [...nums], swapCount: 0 },
    annotations: [
      { type: 'label', text: 'slow 指针初始化', position: 'top' },
      { type: 'region', fromIndex: 0, toIndex: nums.length - 1, text: '待处理区域', color: '#e5e7eb' }
    ],
    highlightIndices: [0],
  }));

  // 1.2 初始化快指针
  steps.push(createStep({
    id: stepId++,
    array: [...nums],
    slowPointer: 0,
    fastPointer: 0,
    action: 'init_fast',
    description: '初始化快指针 fast = 0',
    detailDescription: '快指针 fast 也指向数组开头，用于遍历数组中的每个元素',
    codeLines: getCodeLineBinding('init'),
    variables: { slow: 0, fast: 0, nums: [...nums], swapCount: 0 },
    annotations: [
      { type: 'label', text: 'fast 指针初始化', position: 'top' },
      { type: 'arrow', fromIndex: 0, toIndex: nums.length - 1, text: '遍历方向 →' }
    ],
    highlightIndices: [0],
  }));

  // ========== 步骤2-N：遍历数组 ==========
  for (let fast = 0; fast < nums.length; fast++) {
    const currentValue = nums[fast];
    const isNonZero = currentValue !== 0;

    // 2.1 比较当前元素
    steps.push(createStep({
      id: stepId++,
      array: [...nums],
      slowPointer: slow,
      fastPointer: fast,
      action: 'compare',
      description: `检查 nums[${fast}] = ${currentValue}`,
      detailDescription: `快指针指向索引 ${fast}，检查该位置的元素值是否为零`,
      codeLines: getCodeLineBinding('compare'),
      variables: { slow, fast, nums: [...nums], swapCount },
      annotations: [
        { type: 'comparison', fromIndex: fast, text: `nums[${fast}] = ${currentValue}` },
        { type: 'label', text: isNonZero ? '非零元素 ✓' : '零元素 ✗', position: 'top' }
      ],
      highlightIndices: [fast],
      animation: {
        type: 'compare',
        fromIndex: fast,
        duration: 300,
      },
    }));

    // 2.2 根据比较结果执行不同操作
    if (isNonZero) {
      // 2.2.1 比较结果：非零
      steps.push(createStep({
        id: stepId++,
        array: [...nums],
        slowPointer: slow,
        fastPointer: fast,
        action: 'compare_nonzero',
        description: `${currentValue} ≠ 0，需要处理`,
        detailDescription: `元素 ${currentValue} 不为零，需要将其移动到 slow 指针位置`,
        codeLines: getCodeLineBinding('compare'),
        variables: { slow, fast, nums: [...nums], swapCount },
        annotations: [
          { type: 'label', text: `${currentValue} ≠ 0`, position: 'top', color: '#059669' }
        ],
        highlightIndices: [fast],
      }));

      // 如果 slow != fast，需要交换
      if (slow !== fast) {
        const slowValue = nums[slow];
        
        // 2.2.2 准备交换
        steps.push(createStep({
          id: stepId++,
          array: [...nums],
          slowPointer: slow,
          fastPointer: fast,
          action: 'swap_prepare',
          description: `准备交换 nums[${slow}] 和 nums[${fast}]`,
          detailDescription: `将要交换位置 ${slow} 的值 ${slowValue} 和位置 ${fast} 的值 ${currentValue}`,
          codeLines: getCodeLineBinding('swap'),
          variables: { slow, fast, nums: [...nums], swapCount },
          annotations: [
            { type: 'arrow', fromIndex: slow, toIndex: fast, text: '准备交换' },
            { type: 'label', text: `${slowValue} ↔ ${currentValue}`, position: 'bottom' }
          ],
          highlightIndices: [slow, fast],
          animation: {
            type: 'highlight',
            fromIndex: slow,
            toIndex: fast,
            duration: 400,
          },
        }));

        // 2.2.3 执行交换
        const temp = nums[slow];
        nums[slow] = nums[fast];
        nums[fast] = temp;
        swapCount++;

        steps.push(createStep({
          id: stepId++,
          array: [...nums],
          slowPointer: slow,
          fastPointer: fast,
          action: 'swap_execute',
          description: `执行交换：${currentValue} ↔ ${slowValue}`,
          detailDescription: `交换进行中：nums[${slow}] = ${nums[slow]}，nums[${fast}] = ${nums[fast]}`,
          codeLines: getCodeLineBinding('swap'),
          variables: { slow, fast, nums: [...nums], swapCount },
          annotations: [
            { type: 'arrow', fromIndex: slow, toIndex: fast, text: '交换中...' }
          ],
          highlightIndices: [slow, fast],
          animation: {
            type: 'swap',
            fromIndex: slow,
            toIndex: fast,
            duration: 600,
            easing: 'ease-in-out',
          },
        }));

        // 2.2.4 交换完成
        steps.push(createStep({
          id: stepId++,
          array: [...nums],
          slowPointer: slow,
          fastPointer: fast,
          action: 'swap_complete',
          description: `交换完成！第 ${swapCount} 次交换`,
          detailDescription: `交换后：nums[${slow}] = ${nums[slow]}，nums[${fast}] = ${nums[fast]}`,
          codeLines: getCodeLineBinding('swap'),
          variables: { slow, fast, nums: [...nums], swapCount },
          annotations: [
            { type: 'label', text: `✓ 交换完成`, position: 'bottom', color: '#059669' },
            { type: 'region', fromIndex: 0, toIndex: slow, text: '已处理', color: '#d1fae5' }
          ],
          highlightIndices: [slow, fast],
        }));
      } else {
        // slow == fast，不需要交换
        steps.push(createStep({
          id: stepId++,
          array: [...nums],
          slowPointer: slow,
          fastPointer: fast,
          action: 'swap',
          description: `slow = fast = ${slow}，无需交换`,
          detailDescription: `慢指针和快指针指向同一位置，元素已在正确位置`,
          codeLines: getCodeLineBinding('swap'),
          variables: { slow, fast, nums: [...nums], swapCount },
          annotations: [
            { type: 'label', text: '位置相同，跳过交换', position: 'bottom' }
          ],
          highlightIndices: [slow],
        }));
      }

      // 2.2.5 移动 slow 指针
      slow++;
      steps.push(createStep({
        id: stepId++,
        array: [...nums],
        slowPointer: slow,
        fastPointer: fast,
        action: 'move_slow',
        description: `slow 指针右移: ${slow - 1} → ${slow}`,
        detailDescription: `处理完非零元素后，slow 指针向右移动一位，指向下一个待填充位置`,
        codeLines: getCodeLineBinding('move_slow'),
        variables: { slow, fast, nums: [...nums], swapCount },
        annotations: [
          { type: 'arrow', fromIndex: slow - 1, toIndex: slow, text: 'slow++' },
          { type: 'region', fromIndex: 0, toIndex: slow - 1, text: '已排序区', color: '#d1fae5' }
        ],
        highlightIndices: [slow],
        animation: {
          type: 'move',
          fromIndex: slow - 1,
          toIndex: slow,
          duration: 300,
        },
      }));
    } else {
      // 2.3 比较结果：零
      steps.push(createStep({
        id: stepId++,
        array: [...nums],
        slowPointer: slow,
        fastPointer: fast,
        action: 'compare_zero',
        description: `nums[${fast}] = 0，跳过`,
        detailDescription: `元素为零，slow 指针不移动，继续检查下一个元素`,
        codeLines: getCodeLineBinding('compare'),
        variables: { slow, fast, nums: [...nums], swapCount },
        annotations: [
          { type: 'label', text: '= 0，跳过', position: 'top', color: '#6b7280' }
        ],
        highlightIndices: [fast],
      }));
    }

    // 2.4 移动 fast 指针（除了最后一个元素）
    if (fast < nums.length - 1) {
      steps.push(createStep({
        id: stepId++,
        array: [...nums],
        slowPointer: slow,
        fastPointer: fast + 1,
        action: 'move_fast',
        description: `fast 指针右移: ${fast} → ${fast + 1}`,
        detailDescription: `快指针向右移动一位，继续遍历下一个元素`,
        codeLines: getCodeLineBinding('move_fast'),
        variables: { slow, fast: fast + 1, nums: [...nums], swapCount },
        annotations: [
          { type: 'arrow', fromIndex: fast, toIndex: fast + 1, text: 'fast++' }
        ],
        highlightIndices: [fast + 1],
        animation: {
          type: 'move',
          fromIndex: fast,
          toIndex: fast + 1,
          duration: 300,
        },
      }));
    }
  }

  // ========== 最终步骤：完成 ==========
  steps.push(createStep({
    id: stepId++,
    array: [...nums],
    slowPointer: slow,
    fastPointer: nums.length - 1,
    action: 'complete',
    description: `✓ 算法完成！共交换 ${swapCount} 次`,
    detailDescription: `所有非零元素已移到数组前部，所有零元素已移到数组末尾，保持了非零元素的相对顺序`,
    codeLines: getCodeLineBinding('complete'),
    variables: { slow, fast: nums.length - 1, nums: [...nums], swapCount },
    annotations: [
      { type: 'region', fromIndex: 0, toIndex: slow - 1, text: '非零元素', color: '#d1fae5' },
      { type: 'region', fromIndex: slow, toIndex: nums.length - 1, text: '零元素', color: '#e5e7eb' },
      { type: 'label', text: `总交换次数: ${swapCount}`, position: 'bottom' }
    ],
  }));

  return steps;
}

/**
 * 创建算法步骤对象
 */
function createStep(params: {
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
}): AlgorithmStep {
  return {
    id: params.id,
    array: params.array,
    slowPointer: params.slowPointer,
    fastPointer: params.fastPointer,
    action: params.action,
    description: params.description,
    detailDescription: params.detailDescription,
    codeLines: params.codeLines,
    variables: params.variables,
    animation: params.animation,
    annotations: params.annotations,
    highlightIndices: params.highlightIndices,
  };
}

/**
 * 获取步骤的简短描述（用于进度条提示）
 */
export function getStepShortDescription(step: AlgorithmStep): string {
  switch (step.action) {
    case 'init':
    case 'init_slow':
    case 'init_fast':
      return '初始化';
    case 'compare':
    case 'compare_zero':
    case 'compare_nonzero':
      return `检查 [${step.fastPointer}]`;
    case 'swap_prepare':
      return '准备交换';
    case 'swap_execute':
    case 'swap':
      return `交换 [${step.slowPointer}] ↔ [${step.fastPointer}]`;
    case 'swap_complete':
      return '交换完成';
    case 'move_slow':
      return `slow → ${step.slowPointer}`;
    case 'move_fast':
      return `fast → ${step.fastPointer}`;
    case 'complete':
      return '完成';
    default:
      return '';
  }
}

/**
 * 获取步骤的操作类型中文名称
 */
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

/**
 * 获取步骤的颜色主题
 */
export function getActionColor(action: StepAction): string {
  switch (action) {
    case 'init':
    case 'init_slow':
    case 'init_fast':
      return '#2563eb';  // 蓝色
    case 'compare':
    case 'compare_zero':
    case 'compare_nonzero':
      return '#f59e0b';  // 橙色
    case 'swap_prepare':
    case 'swap_execute':
    case 'swap':
      return '#ef4444';  // 红色
    case 'swap_complete':
      return '#059669';  // 绿色
    case 'move_slow':
      return '#059669';  // 绿色
    case 'move_fast':
      return '#f59e0b';  // 橙色
    case 'complete':
      return '#059669';  // 绿色
    default:
      return '#6b7280';  // 灰色
  }
}

export default {
  generateSteps,
  getStepShortDescription,
  getActionName,
  getActionColor,
};
