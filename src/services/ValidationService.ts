/**
 * 数据验证服务
 * 验证用户输入的数组数据是否符合 LeetCode 约束
 * Requirements: 4.2, 4.3, 4.4, 4.5
 */

import { ValidationResult, ValidationRules, DEFAULT_VALIDATION_RULES } from '../types';

/**
 * 解析用户输入字符串为数字数组
 * @param input 用户输入的字符串
 * @returns 验证结果
 */
export function parseInput(input: string): ValidationResult {
  // 去除首尾空白
  const trimmed = input.trim();
  
  // 检查空输入
  if (!trimmed) {
    return {
      isValid: false,
      error: '数组不能为空',
    };
  }

  // 移除可能的方括号
  let cleaned = trimmed;
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1);
  }

  // 再次检查空数组
  if (!cleaned.trim()) {
    return {
      isValid: false,
      error: '数组不能为空',
    };
  }

  // 检查非法字符（只允许数字、逗号、空格、负号）
  const validPattern = /^[\d,\s\-]+$/;
  if (!validPattern.test(cleaned)) {
    return {
      isValid: false,
      error: '包含非法字符，请只输入数字和逗号',
    };
  }

  // 分割并解析数字
  const parts = cleaned.split(',').map(s => s.trim()).filter(s => s !== '');
  
  if (parts.length === 0) {
    return {
      isValid: false,
      error: '数组不能为空',
    };
  }

  const numbers: number[] = [];
  
  for (const part of parts) {
    // 检查是否为有效数字格式
    if (!/^-?\d+$/.test(part)) {
      return {
        isValid: false,
        error: `"${part}" 不是有效的整数`,
      };
    }

    const num = parseInt(part, 10);
    
    // 检查是否为 NaN
    if (isNaN(num)) {
      return {
        isValid: false,
        error: `"${part}" 不是有效的整数`,
      };
    }

    numbers.push(num);
  }

  return {
    isValid: true,
    sanitizedValue: numbers,
  };
}

/**
 * 验证数组是否符合 LeetCode 约束
 * @param array 待验证的数组
 * @param rules 验证规则（可选）
 * @returns 验证结果
 */
export function validateArray(
  array: number[],
  rules: ValidationRules = DEFAULT_VALIDATION_RULES
): ValidationResult {
  // 检查数组长度下限
  if (array.length < rules.minLength) {
    return {
      isValid: false,
      error: '数组不能为空',
    };
  }

  // 检查数组长度上限
  if (array.length > rules.maxLength) {
    return {
      isValid: false,
      error: `数组长度不能超过${rules.maxLength}`,
    };
  }

  // 检查每个元素的值范围
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    
    if (value < rules.minValue || value > rules.maxValue) {
      return {
        isValid: false,
        error: '数值超出32位整数范围',
      };
    }
  }

  return {
    isValid: true,
    sanitizedValue: array,
  };
}

/**
 * 完整验证：解析输入并验证约束
 * @param input 用户输入字符串
 * @param rules 验证规则（可选）
 * @returns 验证结果
 */
export function validateInput(
  input: string,
  rules: ValidationRules = DEFAULT_VALIDATION_RULES
): ValidationResult {
  // 先解析输入
  const parseResult = parseInput(input);
  
  if (!parseResult.isValid) {
    return parseResult;
  }

  // 再验证数组约束
  return validateArray(parseResult.sanitizedValue!, rules);
}

/**
 * 生成随机有效数组
 * 长度 1-20，元素值 -100 到 100，至少包含一个零
 * @returns 随机数组
 */
export function generateRandomArray(): number[] {
  // 随机长度 1-20
  const length = Math.floor(Math.random() * 20) + 1;
  
  // 生成随机数组
  const array: number[] = [];
  
  for (let i = 0; i < length; i++) {
    // 随机值 -100 到 100
    const value = Math.floor(Math.random() * 201) - 100;
    array.push(value);
  }

  // 确保至少有一个零
  const hasZero = array.some(v => v === 0);
  if (!hasZero) {
    // 随机选择一个位置设为零
    const randomIndex = Math.floor(Math.random() * length);
    array[randomIndex] = 0;
  }

  return array;
}

/**
 * 格式化数组为显示字符串
 * @param array 数组
 * @returns 格式化字符串
 */
export function formatArrayForDisplay(array: number[]): string {
  return `[${array.join(', ')}]`;
}

/**
 * 格式化数组为输入字符串（不带方括号）
 * @param array 数组
 * @returns 格式化字符串
 */
export function formatArrayForInput(array: number[]): string {
  return array.join(', ');
}

/**
 * 预设示例数据
 */
export const PRESET_EXAMPLES = [
  { label: '[0,1,0,3,12]', data: [0, 1, 0, 3, 12] },
  { label: '[0]', data: [0] },
  { label: '[1,2,3]', data: [1, 2, 3] },
  { label: '[0,0,1]', data: [0, 0, 1] },
  { label: '[1,0,1]', data: [1, 0, 1] },
];

// 导出服务对象
export const ValidationService = {
  parseInput,
  validateArray,
  validateInput,
  generateRandomArray,
  formatArrayForDisplay,
  formatArrayForInput,
  PRESET_EXAMPLES,
};

export default ValidationService;
