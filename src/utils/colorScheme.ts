/**
 * 配色方案工具
 * 定义协调的颜色调色板，严禁使用紫色
 * Requirements: 10.2, 6.3
 */

// ============ 主色调 ============
export const COLORS = {
  // 主要颜色
  primary: '#2563eb',        // 蓝色 - 主要操作和非零元素
  primaryLight: '#3b82f6',   // 浅蓝色
  primaryDark: '#1d4ed8',    // 深蓝色
  
  // 次要颜色
  secondary: '#059669',      // 绿色 - 成功状态、已播放进度
  secondaryLight: '#10b981', // 浅绿色
  secondaryDark: '#047857',  // 深绿色
  
  // 中性色
  gray: '#6b7280',           // 灰色 - 零元素、未播放进度
  grayLight: '#9ca3af',      // 浅灰色
  grayDark: '#4b5563',       // 深灰色
  grayLighter: '#d1d5db',    // 更浅灰色
  grayLightest: '#f3f4f6',   // 最浅灰色 - 背景
  
  // 强调色
  accent: '#f59e0b',         // 橙色 - 警告、高亮
  accentLight: '#fbbf24',    // 浅橙色
  accentDark: '#d97706',     // 深橙色
  
  // 错误色
  error: '#dc2626',          // 红色 - 错误状态
  errorLight: '#ef4444',     // 浅红色
  errorDark: '#b91c1c',      // 深红色
  
  // 背景色
  background: '#ffffff',     // 白色背景
  backgroundAlt: '#f9fafb',  // 备用背景
  
  // 文字色
  text: '#1f2937',           // 主要文字
  textLight: '#6b7280',      // 次要文字
  textInverse: '#ffffff',    // 反色文字
  
  // 边框色
  border: '#e5e7eb',         // 边框
  borderDark: '#d1d5db',     // 深边框
} as const;

// ============ 数组元素颜色 ============
export const ARRAY_ELEMENT_COLORS = {
  // 零元素 - 灰色
  zero: {
    fill: COLORS.gray,
    stroke: COLORS.grayDark,
    text: COLORS.textInverse,
  },
  // 非零元素 - 蓝色
  nonZero: {
    fill: COLORS.primary,
    stroke: COLORS.primaryDark,
    text: COLORS.textInverse,
  },
  // 高亮元素 - 橙色（当前操作的元素）
  highlighted: {
    fill: COLORS.accent,
    stroke: COLORS.accentDark,
    text: COLORS.text,
  },
  // 已处理元素 - 绿色
  processed: {
    fill: COLORS.secondary,
    stroke: COLORS.secondaryDark,
    text: COLORS.textInverse,
  },
} as const;

// ============ 指针颜色 ============
export const POINTER_COLORS = {
  slow: {
    fill: COLORS.secondary,
    stroke: COLORS.secondaryDark,
    text: COLORS.textInverse,
    label: '#059669',
  },
  fast: {
    fill: COLORS.accent,
    stroke: COLORS.accentDark,
    text: COLORS.text,
    label: '#f59e0b',
  },
} as const;

// ============ 进度条颜色 ============
export const PROGRESS_COLORS = {
  played: COLORS.secondary,      // 已播放 - 绿色
  unplayed: COLORS.grayLighter,  // 未播放 - 浅灰色
  handle: COLORS.primary,        // 拖动手柄 - 蓝色
} as const;

// ============ 代码高亮颜色 ============
export const CODE_HIGHLIGHT_COLORS = {
  currentLine: '#fef3c7',        // 当前行背景 - 浅黄色
  lineNumber: COLORS.textLight,  // 行号颜色
  keyword: '#2563eb',            // 关键字 - 蓝色
  string: '#059669',             // 字符串 - 绿色
  number: '#d97706',             // 数字 - 橙色
  comment: COLORS.grayLight,     // 注释 - 浅灰色
  function: '#0891b2',           // 函数 - 青色
  variable: '#1f2937',           // 变量 - 深灰色
} as const;

// ============ 箭头颜色 ============
export const ARROW_COLORS = {
  swap: COLORS.accent,           // 交换箭头 - 橙色
  move: COLORS.primary,          // 移动箭头 - 蓝色
  dataFlow: COLORS.secondary,    // 数据流箭头 - 绿色
} as const;

// ============ 按钮颜色 ============
export const BUTTON_COLORS = {
  primary: {
    background: COLORS.primary,
    text: COLORS.textInverse,
    hover: COLORS.primaryDark,
    disabled: COLORS.grayLight,
  },
  secondary: {
    background: COLORS.grayLightest,
    text: COLORS.text,
    hover: COLORS.grayLighter,
    disabled: COLORS.grayLightest,
  },
  success: {
    background: COLORS.secondary,
    text: COLORS.textInverse,
    hover: COLORS.secondaryDark,
    disabled: COLORS.grayLight,
  },
} as const;

// ============ 类型定义 ============
export interface ElementColorScheme {
  fill: string;
  stroke: string;
  text: string;
}

export interface PointerColorScheme extends ElementColorScheme {
  label: string;
}

// ============ 工具函数 ============

/**
 * 根据数组元素值获取对应的颜色
 * @param value 元素值
 * @param isHighlighted 是否高亮
 * @param isProcessed 是否已处理
 */
export function getArrayElementColor(
  value: number,
  isHighlighted: boolean = false,
  isProcessed: boolean = false
): ElementColorScheme {
  if (isHighlighted) {
    return ARRAY_ELEMENT_COLORS.highlighted;
  }
  if (isProcessed) {
    return ARRAY_ELEMENT_COLORS.processed;
  }
  return value === 0 ? ARRAY_ELEMENT_COLORS.zero : ARRAY_ELEMENT_COLORS.nonZero;
}

/**
 * 根据指针类型获取颜色
 * @param pointerType 指针类型
 */
export function getPointerColor(pointerType: 'slow' | 'fast'): PointerColorScheme {
  return POINTER_COLORS[pointerType];
}

/**
 * 检查颜色是否包含紫色
 * 紫色定义：R和B都较高，G较低
 * @param hexColor 十六进制颜色值
 * @returns 是否为紫色
 */
export function isPurpleColor(hexColor: string): boolean {
  // 移除 # 前缀
  const hex = hexColor.replace('#', '');
  
  // 解析 RGB 值
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // 紫色判断：R和B都大于150，G小于100
  // 或者 R和B的平均值比G高出80以上
  const isPurple = (r > 150 && b > 150 && g < 100) ||
                   ((r + b) / 2 - g > 80 && r > 100 && b > 100);
  
  return isPurple;
}

/**
 * 验证配色方案中没有紫色
 * @returns 验证结果
 */
export function validateNoPurpleColors(): { isValid: boolean; purpleColors: string[] } {
  const purpleColors: string[] = [];
  
  // 检查所有颜色常量
  const allColors = [
    ...Object.values(COLORS),
    ...Object.values(ARRAY_ELEMENT_COLORS.zero),
    ...Object.values(ARRAY_ELEMENT_COLORS.nonZero),
    ...Object.values(ARRAY_ELEMENT_COLORS.highlighted),
    ...Object.values(ARRAY_ELEMENT_COLORS.processed),
    ...Object.values(POINTER_COLORS.slow),
    ...Object.values(POINTER_COLORS.fast),
    ...Object.values(PROGRESS_COLORS),
    ...Object.values(CODE_HIGHLIGHT_COLORS),
    ...Object.values(ARROW_COLORS),
    ...Object.values(BUTTON_COLORS.primary),
    ...Object.values(BUTTON_COLORS.secondary),
    ...Object.values(BUTTON_COLORS.success),
  ];
  
  for (const color of allColors) {
    if (typeof color === 'string' && color.startsWith('#') && isPurpleColor(color)) {
      purpleColors.push(color);
    }
  }
  
  return {
    isValid: purpleColors.length === 0,
    purpleColors,
  };
}

// 导出默认配色方案
export default {
  COLORS,
  ARRAY_ELEMENT_COLORS,
  POINTER_COLORS,
  PROGRESS_COLORS,
  CODE_HIGHLIGHT_COLORS,
  ARROW_COLORS,
  BUTTON_COLORS,
  getArrayElementColor,
  getPointerColor,
  isPurpleColor,
  validateNoPurpleColors,
};
