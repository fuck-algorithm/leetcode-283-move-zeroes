// 定义支持的语言类型
export type ProgrammingLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'go';

// 定义代码示例接口
export interface CodeExamplesType {
  [key: string]: string;
}

export const codeExamples: CodeExamplesType = {
  javascript: `/**
 * LeetCode 283. 移动零
 * @param {number[]} nums
 * @return {void} 原地修改数组
 */
function moveZeroes(nums) {
  // 双指针法
  let nonZeroIndex = 0;
  
  // 第一步：将所有非零元素移到数组前部
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[nonZeroIndex] = nums[i];
      nonZeroIndex++;
    }
  }
  
  // 第二步：将剩余位置填充0
  for (let i = nonZeroIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
  
  return nums; // 返回修改后的数组（非必须）
}`,

  python: `"""
LeetCode 283. 移动零
原地修改数组，将所有的0移到末尾，同时保持非零元素的相对顺序
"""
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        # 双指针法
        non_zero_pos = 0
        
        # 第一步：将所有非零元素移到数组前部
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[non_zero_pos] = nums[i]
                non_zero_pos += 1
        
        # 第二步：将剩余位置填充0
        for i in range(non_zero_pos, len(nums)):
            nums[i] = 0`,

  java: `/**
 * LeetCode 283. 移动零
 * 原地移动数组元素，将所有0移至末尾，保持非零元素相对顺序
 */
class Solution {
    public void moveZeroes(int[] nums) {
        // 双指针法
        int nonZeroIndex = 0;
        
        // 第一步：将所有非零元素移到数组前部
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[nonZeroIndex] = nums[i];
                nonZeroIndex++;
            }
        }
        
        // 第二步：将剩余位置填充0
        for (int i = nonZeroIndex; i < nums.length; i++) {
            nums[i] = 0;
        }
    }
}`,

  cpp: `/**
 * LeetCode 283. 移动零
 * 原地修改数组，将所有0移至末尾，保持非零元素相对顺序
 */
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        // 双指针法
        int nonZeroIndex = 0;
        
        // 第一步：将所有非零元素移到数组前部
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != 0) {
                nums[nonZeroIndex] = nums[i];
                nonZeroIndex++;
            }
        }
        
        // 第二步：将剩余位置填充0
        for (int i = nonZeroIndex; i < nums.size(); i++) {
            nums[i] = 0;
        }
    }
};`,

  go: `/**
 * LeetCode 283. 移动零
 * 原地修改数组，将所有0移至末尾，保持非零元素相对顺序
 */
func moveZeroes(nums []int) {
    // 双指针法
    nonZeroIndex := 0
    
    // 第一步：将所有非零元素移到数组前部
    for i := 0; i < len(nums); i++ {
        if nums[i] != 0 {
            nums[nonZeroIndex] = nums[i]
            nonZeroIndex++
        }
    }
    
    // 第二步：将剩余位置填充0
    for i := nonZeroIndex; i < len(nums); i++ {
        nums[i] = 0
    }
}`
}; 