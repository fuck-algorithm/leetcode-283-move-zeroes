// 定义支持的语言类型
export type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go';

// 不同语言的移动零算法实现
export const codeSnippets: Record<ProgrammingLanguage, string[]> = {
  javascript: [
    'function moveZeroes(nums) {',
    '  let slow = 0;',
    '  for (let fast = 0; fast < nums.length; fast++) {',
    '    if (nums[fast] !== 0) {',
    '      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];',
    '      slow++;',
    '    }',
    '  }',
    '  return nums;',
    '}'
  ],
  
  typescript: [
    'function moveZeroes(nums: number[]): number[] {',
    '  let slow: number = 0;',
    '  for (let fast: number = 0; fast < nums.length; fast++) {',
    '    if (nums[fast] !== 0) {',
    '      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];',
    '      slow++;',
    '    }',
    '  }',
    '  return nums;',
    '}'
  ],
  
  python: [
    'def moveZeroes(nums):',
    '    slow = 0',
    '    for fast in range(len(nums)):',
    '        if nums[fast] != 0:',
    '            nums[slow], nums[fast] = nums[fast], nums[slow]',
    '            slow += 1',
    '    return nums'
  ],
  
  java: [
    'public void moveZeroes(int[] nums) {',
    '    int slow = 0;',
    '    for (int fast = 0; fast < nums.length; fast++) {',
    '        if (nums[fast] != 0) {',
    '            int temp = nums[slow];',
    '            nums[slow] = nums[fast];',
    '            nums[fast] = temp;',
    '            slow++;',
    '        }',
    '    }',
    '}'
  ],
  
  cpp: [
    'void moveZeroes(vector<int>& nums) {',
    '    int slow = 0;',
    '    for (int fast = 0; fast < nums.size(); fast++) {',
    '        if (nums[fast] != 0) {',
    '            swap(nums[slow], nums[fast]);',
    '            slow++;',
    '        }',
    '    }',
    '}'
  ],
  
  go: [
    'func moveZeroes(nums []int) {',
    '    slow := 0',
    '    for fast := 0; fast < len(nums); fast++ {',
    '        if nums[fast] != 0 {',
    '            nums[slow], nums[fast] = nums[fast], nums[slow]',
    '            slow++',
    '        }',
    '    }',
    '}'
  ]
};

// 不同语言的高亮行(对应算法当前步骤)
export const getHighlightedLine = (language: ProgrammingLanguage, stepIndex: number): number => {
  // 不同的语言可能行号有所不同，这里我们根据语言和步骤索引返回对应的高亮行
  switch (language) {
    case 'python':
      if (stepIndex <= 0) return 1; // 初始化
      if (stepIndex >= 1 && stepIndex < 3) return 3; // for 循环开始
      if (stepIndex >= 3 && stepIndex < 5) return 4; // if 判断
      if (stepIndex >= 5 && stepIndex < 7) return 5; // 交换
      if (stepIndex >= 7 && stepIndex < 9) return 6; // slow++
      return 7; // 结束
      
    case 'go':
      if (stepIndex <= 0) return 1; // 初始化
      if (stepIndex >= 1 && stepIndex < 3) return 3; // for 循环开始
      if (stepIndex >= 3 && stepIndex < 5) return 4; // if 判断
      if (stepIndex >= 5 && stepIndex < 7) return 5; // 交换
      if (stepIndex >= 7 && stepIndex < 9) return 6; // slow++
      return 7; // 结束
      
    default:
      // JavaScript, TypeScript, Java, C++的行号基本相似
      if (stepIndex <= 0) return 1; // 初始化
      if (stepIndex >= 1 && stepIndex < 3) return 3; // for 循环开始
      if (stepIndex >= 3 && stepIndex < 5) return 4; // if 判断
      if (stepIndex >= 5 && stepIndex < 7) return 5; // 交换
      if (stepIndex >= 7 && stepIndex < 9) return 6; // slow++
      return 8; // 结束
  }
};

// 语言选项
export const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' }
]; 