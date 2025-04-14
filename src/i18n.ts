import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 定义翻译内容，而不是从文件导入
const enTranslation = {
  "app": {
    "title": "Move Zeroes Algorithm Visualization",
    "description": "A visualization of LeetCode 283 - Move Zeroes",
    "viewSource": "View Source Code"
  },
  "algorithm": {
    "description": "Given an array nums, write a function to move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
    "note": "You must do this in-place without making a copy of the array.",
    "example": "Input: [0,1,0,3,12] \nOutput: [1,3,12,0,0]",
    "inputLabel": "Input array (separated by commas)",
    "inputPlaceholder": "e.g., 0,1,0,3,12",
    "moveZeroesButton": "Move Zeroes",
    "resultTitle": "Result",
    "inputError": "Please ensure correct input format, e.g.: 0,1,0,3,12",
    "compare": "Compare Elements"
  },
  "controls": {
    "start": "Start",
    "pause": "Pause",
    "reset": "Reset",
    "next": "Next Step",
    "previous": "Previous Step",
    "apply": "Apply",
    "speed": "Speed",
    "random": "Random",
    "inputPlaceholder": "Enter array, e.g.: 0,1,0,3,12"
  },
  "language": {
    "change": "Change Language",
    "en": "English",
    "zh": "中文 (Chinese)"
  },
  "presets": {
    "example1": "LeetCode Example 1",
    "example2": "LeetCode Example 2",
    "allZeros": "All Zeros",
    "noZeros": "No Zeros",
    "zerosAtEnd": "Zeros at End",
    "longArray": "Long Array"
  },
  "errors": {
    "nonNumeric": "Contains non-numeric values",
    "emptyArray": "Array cannot be empty",
    "tooLarge": "Array length cannot exceed 100",
    "invalidInput": "Please enter a valid array, e.g.: 0,1,0,3,12"
  },
  "visualization": {
    "title": "Visualization Display",
    "loading": "Loading...",
    "movePointer": "Move Pointer",
    "initialize": "Initialize",
    "complete": "Complete",
    "swap": "Swap",
    "swapCount": "Swap Count",
    "step": "Step",
    "of": "of"
  },
  "algorithmSteps": {
    "init": "Initialize: Fast and slow pointers both at the start position, ready to traverse",
    "checking": "Check: Fast pointer ({0}) checks if element {1} is zero",
    "skip": "Skip: Fast pointer ({0}) found element 0, slow pointer does not move",
    "noSwapNeeded": "No swap needed: Slow pointer ({0}) position already has non-zero number {1}",
    "swap": "Swap: Found non-zero element {0}, exchanged with 0 at position {1}",
    "advance": "Advance: Slow pointer moves forward to position {0}",
    "complete": "Complete: All zeros moved to the end, non-zero elements kept in original order",
    "startMovingZeroes": "Start moving zero elements",
    "checkElement": "Check element {0}",
    "moveToPosition": "Move {0} to position {1}",
    "elementMoved": "{0} moved to position {1}",
    "movingPointers": "Moving pointers",
    "zeroesMoveComplete": "Completed moving zeros"
  }
};

const zhTranslation = {
  "app": {
    "title": "移动零算法可视化",
    "description": "力扣 283 题 - 移动零 的算法可视化",
    "viewSource": "查看源代码"
  },
  "algorithm": {
    "description": "给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。",
    "note": "必须在不复制数组的情况下原地对数组进行操作。",
    "example": "输入: [0,1,0,3,12] \n输出: [1,3,12,0,0]",
    "inputLabel": "输入数组（用逗号分隔）",
    "inputPlaceholder": "例如：0,1,0,3,12",
    "moveZeroesButton": "移动零",
    "resultTitle": "结果",
    "inputError": "请确保输入格式正确，例如：0,1,0,3,12",
    "compare": "比较元素"
  },
  "controls": {
    "start": "开始",
    "pause": "暂停",
    "reset": "重置",
    "next": "下一步",
    "previous": "上一步",
    "apply": "应用",
    "speed": "速度",
    "random": "随机",
    "inputPlaceholder": "输入数组，例如：0,1,0,3,12"
  },
  "language": {
    "change": "切换语言",
    "en": "English (英文)",
    "zh": "中文"
  },
  "presets": {
    "example1": "力扣示例1",
    "example2": "力扣示例2",
    "allZeros": "全是零",
    "noZeros": "无零数组",
    "zerosAtEnd": "零在末尾",
    "longArray": "较长数组"
  },
  "errors": {
    "nonNumeric": "包含非数字值",
    "emptyArray": "数组不能为空",
    "tooLarge": "数组长度不能超过100",
    "invalidInput": "请输入有效的数组，例如：0,1,0,3,12"
  },
  "visualization": {
    "title": "可视化演示",
    "loading": "加载中...",
    "movePointer": "移动指针",
    "initialize": "初始化",
    "complete": "完成",
    "swap": "交换",
    "swapCount": "交换次数",
    "step": "步骤",
    "of": "/"
  },
  "algorithmSteps": {
    "init": "初始化：快指针和慢指针都指向数组开始位置，准备开始遍历",
    "checking": "检查：快指针({0})检查元素{1}是否为零",
    "skip": "跳过：快指针({0})发现元素0，慢指针不移动",
    "noSwapNeeded": "无需交换：慢指针({0})位置已是非零数{1}",
    "swap": "交换：找到非零元素{0}，与位置{1}的0进行交换",
    "advance": "前进：慢指针前进一步到位置{0}",
    "complete": "完成：所有零已移动到数组末尾，非零元素保持原有顺序",
    "startMovingZeroes": "开始移动零元素",
    "checkElement": "检查元素 {0}",
    "moveToPosition": "将 {0} 移动到位置 {1}",
    "elementMoved": "{0} 已移动到位置 {1}",
    "movingPointers": "移动指针",
    "zeroesMoveComplete": "完成移动零元素"
  }
};

// 添加一个直接的翻译函数
export const getTranslation = (key: string, language?: string): string => {
  const lang = language || i18n.language || 'en';
  const langPrefix = lang.startsWith('zh') ? 'zh' : 'en';
  
  // 分解键来查找嵌套对象
  const keyParts = key.split('.');
  
  // 获取翻译资源
  const translations = langPrefix === 'zh' ? zhTranslation : enTranslation;
  
  // 导航到嵌套对象
  let result: any = translations;
  for (const part of keyParts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      return key; // 如果找不到，返回键本身
    }
  }
  
  return typeof result === 'string' ? result : key;
};

// 用于格式化带参数的翻译
export const formatTranslation = (key: string, args: any[], language?: string): string => {
  let text = getTranslation(key, language);
  
  if (!args || args.length === 0) return text;
  
  // 替换所有{0}, {1}等占位符
  args.forEach((arg, index) => {
    const placeholder = `\\{${index}\\}`;  // 转义花括号，使其作为字面字符
    text = text.replace(new RegExp(placeholder, 'g'), String(arg));
  });
  
  return text;
};

// 从localStorage获取用户之前选择的语言
const savedLanguage = localStorage.getItem('userLanguage');

i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    fallbackLng: 'en',
    // 如果有保存的语言，则使用保存的语言，否则自动检测浏览器语言
    lng: savedLanguage || undefined,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false // 不转义HTML
    },
    // 添加以下配置以支持回退值
    returnNull: false,
    returnEmptyString: false,
    keySeparator: false
  });

// 添加一个函数用于更改语言并保存到localStorage
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  localStorage.setItem('userLanguage', language);
};

// 自定义钩子，避开类型检查问题
export const useCustomTranslation = () => {
  const { i18n } = useTranslation();
  
  // 使用我们自己的翻译函数，不依赖于t函数
  const t = (key: string) => getTranslation(key, i18n.language);
  
  // 添加formatT函数用于带参数的翻译
  const formatT = (key: string, ...args: any[]) => formatTranslation(key, args, i18n.language);
  
  return { t, formatT, i18n };
};

export default i18n; 