/**
 * 算法可视化核心类型定义
 * Requirements: 9.1, 9.2
 */

// ============ 支持的编程语言 ============
export type SupportedLanguage = 'java' | 'python' | 'golang' | 'javascript';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['java', 'python', 'golang', 'javascript'];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  java: 'Java',
  python: 'Python',
  golang: 'Go',
  javascript: 'JavaScript'
};

// ============ 算法步骤类型 ============
export type StepAction = 
  | 'init'           // 初始化
  | 'init_slow'      // 初始化慢指针
  | 'init_fast'      // 初始化快指针
  | 'compare'        // 比较元素
  | 'compare_zero'   // 比较结果为零
  | 'compare_nonzero'// 比较结果非零
  | 'swap_prepare'   // 准备交换
  | 'swap_execute'   // 执行交换
  | 'swap_complete'  // 交换完成
  | 'swap'           // 交换元素（兼容旧版）
  | 'move_slow'      // 移动慢指针
  | 'move_fast'      // 移动快指针
  | 'complete';      // 完成

// 步骤阶段，用于更细粒度的动画控制
export type StepPhase = 
  | 'start'          // 步骤开始
  | 'highlight'      // 高亮元素
  | 'animate'        // 执行动画
  | 'end';           // 步骤结束

export interface CodeLineBinding {
  java: number[];
  python: number[];
  golang: number[];
  javascript: number[];
}

export interface VariableSnapshot {
  slow: number;
  fast: number;
  nums: number[];
  swapCount?: number;
}

export interface AnimationConfig {
  type: 'swap' | 'highlight' | 'move' | 'pulse' | 'compare';
  fromIndex?: number;
  toIndex?: number;
  duration: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// 画布标注配置
export interface AnnotationConfig {
  type: 'arrow' | 'label' | 'region' | 'comparison';
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  fromIndex?: number;
  toIndex?: number;
  color?: string;
}

export interface AlgorithmStep {
  id: number;
  array: number[];
  slowPointer: number;
  fastPointer: number;
  action: StepAction;
  phase?: StepPhase;
  description: string;
  detailDescription?: string;  // 更详细的描述
  codeLines: CodeLineBinding;
  variables: VariableSnapshot;
  animation?: AnimationConfig;
  annotations?: AnnotationConfig[];  // 画布标注
  highlightIndices?: number[];  // 需要高亮的元素索引
}

// ============ 验证相关类型 ============
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: number[];
}

export interface ValidationRules {
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
}

export const DEFAULT_VALIDATION_RULES: ValidationRules = {
  minLength: 1,
  maxLength: 10000,
  minValue: -(2 ** 31),
  maxValue: 2 ** 31 - 1
};

// ============ IndexedDB 缓存类型 ============
export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt: number;
}

export interface UserPreferences {
  language: SupportedLanguage;
  playbackSpeed: number;
  lastUpdated: number;
}

export interface GitHubCache {
  starCount: number;
  fetchedAt: number;
  expiresAt: number;
}

// ============ 组件 Props 类型 ============
export interface TitleBarProps {
  problemNumber: number;
  problemTitle: string;
  leetCodeUrl: string;
}

export interface GitHubBadgeProps {
  repoUrl: string;
  owner: string;
  repo: string;
}

export interface AlgorithmExplanationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DataInputProps {
  onArrayChange: (array: number[]) => void;
  initialArray: number[];
}

export interface PresetExample {
  label: string;
  data: number[];
}

export interface CodeDisplayProps {
  language: SupportedLanguage;
  currentStep: AlgorithmStep | null;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export interface CodeLine {
  lineNumber: number;
  content: string;
  isHighlighted: boolean;
  variables?: VariableValue[];
}

export interface VariableValue {
  name: string;
  value: string | number | number[];
}

export interface D3CanvasProps {
  step: AlgorithmStep | null;
  width: number;
  height: number;
  onZoom?: (transform: any) => void;
}

export interface ControlPanelProps {
  isPlaying: boolean;
  canStepBackward: boolean;
  canStepForward: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onSeek: (step: number) => void;
}

export interface WeChatFloatProps {
  qrCodeUrl: string;
  promptText: string;
}

// ============ 画布元素类型 ============
export interface CanvasElement {
  type: 'array' | 'pointer' | 'arrow' | 'annotation';
  id: string;
  position: { x: number; y: number };
  data: any;
}

export interface ArrayElement {
  index: number;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isZero: boolean;
}

export interface PointerElement {
  name: 'slow' | 'fast';
  index: number;
  x: number;
  y: number;
  label: string;
}

export interface ArrowElement {
  fromIndex: number;
  toIndex: number;
  label?: string;
}

// ============ 状态管理类型 ============
export interface AlgorithmState {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  inputArray: number[];
}

export interface UIState {
  language: SupportedLanguage;
  isExplanationOpen: boolean;
  error: string | null;
}
