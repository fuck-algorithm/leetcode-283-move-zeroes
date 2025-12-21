/**
 * 代码行映射器
 * 定义多语言代码和步骤到代码行的映射关系
 * Requirements: 9.2, 9.3
 */

import { SupportedLanguage, CodeLineBinding, StepAction } from '../types';

// ============ 各语言代码定义 ============

export const CODE_SNIPPETS: Record<SupportedLanguage, string> = {
  java: `public void moveZeroes(int[] nums) {
    int slow = 0;
    for (int fast = 0; fast < nums.length; fast++) {
        if (nums[fast] != 0) {
            int temp = nums[slow];
            nums[slow] = nums[fast];
            nums[fast] = temp;
            slow++;
        }
    }
}`,

  python: `def moveZeroes(nums: List[int]) -> None:
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1`,

  golang: `func moveZeroes(nums []int) {
    slow := 0
    for fast := 0; fast < len(nums); fast++ {
        if nums[fast] != 0 {
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow++
        }
    }
}`,

  javascript: `function moveZeroes(nums) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;
        }
    }
}`,
};

// ============ 步骤到代码行的映射 ============

/**
 * 每种操作对应的代码行号
 * 行号从 1 开始计数
 */
const LINE_MAPPINGS: Record<StepAction, CodeLineBinding> = {
  init: {
    java: [2],        // int slow = 0;
    python: [2],      // slow = 0
    golang: [2],      // slow := 0
    javascript: [2],  // let slow = 0;
  },
  init_slow: {
    java: [2],
    python: [2],
    golang: [2],
    javascript: [2],
  },
  init_fast: {
    java: [3],
    python: [3],
    golang: [3],
    javascript: [3],
  },
  compare: {
    java: [3, 4],     // for 循环和 if 判断
    python: [3, 4],   // for 循环和 if 判断
    golang: [3, 4],   // for 循环和 if 判断
    javascript: [3, 4], // for 循环和 if 判断
  },
  compare_zero: {
    java: [4],
    python: [4],
    golang: [4],
    javascript: [4],
  },
  compare_nonzero: {
    java: [4],
    python: [4],
    golang: [4],
    javascript: [4],
  },
  swap_prepare: {
    java: [5, 6, 7],
    python: [5],
    golang: [5],
    javascript: [5],
  },
  swap_execute: {
    java: [5, 6, 7],
    python: [5],
    golang: [5],
    javascript: [5],
  },
  swap_complete: {
    java: [5, 6, 7],
    python: [5],
    golang: [5],
    javascript: [5],
  },
  swap: {
    java: [5, 6, 7],  // 交换三行
    python: [5],      // 单行交换
    golang: [5],      // 单行交换
    javascript: [5],  // 解构赋值交换
  },
  move_slow: {
    java: [8],        // slow++;
    python: [6],      // slow += 1
    golang: [6],      // slow++
    javascript: [6],  // slow++;
  },
  move_fast: {
    java: [3],        // for 循环头
    python: [3],      // for 循环头
    golang: [3],      // for 循环头
    javascript: [3],  // for 循环头
  },
  complete: {
    java: [11],       // 函数结束
    python: [6],      // 函数最后一行
    golang: [9],      // 函数结束
    javascript: [8],  // 函数结束
  },
};

/**
 * 获取指定操作的代码行绑定
 * @param action 步骤操作类型
 * @returns 代码行绑定
 */
export function getCodeLineBinding(action: StepAction): CodeLineBinding {
  return LINE_MAPPINGS[action];
}

/**
 * 获取指定语言的代码行号
 * @param action 步骤操作类型
 * @param language 编程语言
 * @returns 代码行号数组
 */
export function getCodeLines(action: StepAction, language: SupportedLanguage): number[] {
  return LINE_MAPPINGS[action][language];
}

/**
 * 获取指定语言的代码字符串
 * @param language 编程语言
 * @returns 代码字符串
 */
export function getCodeSnippet(language: SupportedLanguage): string {
  return CODE_SNIPPETS[language];
}

/**
 * 将代码字符串分割为行数组
 * @param language 编程语言
 * @returns 代码行数组
 */
export function getCodeLines2Array(language: SupportedLanguage): string[] {
  return CODE_SNIPPETS[language].split('\n');
}

/**
 * 获取代码总行数
 * @param language 编程语言
 * @returns 总行数
 */
export function getCodeLineCount(language: SupportedLanguage): number {
  return CODE_SNIPPETS[language].split('\n').length;
}

/**
 * 验证代码行绑定是否有效
 * @param binding 代码行绑定
 * @returns 是否有效
 */
export function validateCodeLineBinding(binding: CodeLineBinding): boolean {
  const languages: SupportedLanguage[] = ['java', 'python', 'golang', 'javascript'];
  
  for (const lang of languages) {
    const lines = binding[lang];
    const maxLine = getCodeLineCount(lang);
    
    // 检查每个行号是否在有效范围内
    for (const line of lines) {
      if (line < 1 || line > maxLine) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * 获取所有语言的代码信息
 */
export function getAllCodeInfo(): Record<SupportedLanguage, { code: string; lineCount: number }> {
  const languages: SupportedLanguage[] = ['java', 'python', 'golang', 'javascript'];
  const result: Record<string, { code: string; lineCount: number }> = {};
  
  for (const lang of languages) {
    result[lang] = {
      code: CODE_SNIPPETS[lang],
      lineCount: getCodeLineCount(lang),
    };
  }
  
  return result as Record<SupportedLanguage, { code: string; lineCount: number }>;
}

export default {
  CODE_SNIPPETS,
  getCodeLineBinding,
  getCodeLines,
  getCodeSnippet,
  getCodeLines2Array,
  getCodeLineCount,
  validateCodeLineBinding,
  getAllCodeInfo,
};
