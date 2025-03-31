import React, { useState } from 'react';

/**
 * 实现 LeetCode 283. Move Zeroes
 * 给定一个数组，将所有的0移动到数组的末尾，同时保持非零元素的相对顺序。
 */
const MoveZeroes: React.FC = () => {
  const [inputArray, setInputArray] = useState<string>('0,1,0,3,12');
  const [resultArray, setResultArray] = useState<number[]>([]);

  // 移动零的算法实现
  const moveZeroes = (nums: number[]): number[] => {
    // 创建一个新数组以避免直接修改原数组
    const result = [...nums];
    let nonZeroIndex = 0;
    
    // 第一步：将所有非零元素前移
    for (let i = 0; i < result.length; i++) {
      if (result[i] !== 0) {
        result[nonZeroIndex] = result[i];
        nonZeroIndex++;
      }
    }
    
    // 第二步：将剩余位置填充为0
    for (let i = nonZeroIndex; i < result.length; i++) {
      result[i] = 0;
    }
    
    return result;
  };

  // 处理输入改变
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputArray(e.target.value);
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 将输入字符串转换为数字数组
      const nums = inputArray.split(',').map(num => parseInt(num.trim(), 10));
      const result = moveZeroes(nums);
      setResultArray(result);
    } catch (error) {
      console.error('输入格式有误', error);
      alert('请确保输入格式正确，例如：0,1,0,3,12');
    }
  };

  return (
    <div className="move-zeroes">
      <h2>LeetCode 283: 移动零</h2>
      <p>给定一个数组，将所有的0移动到数组的末尾，同时保持非零元素的相对顺序。</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="array-input">输入数组（用逗号分隔）：</label>
          <input
            id="array-input"
            type="text"
            value={inputArray}
            onChange={handleInputChange}
            placeholder="例如：0,1,0,3,12"
          />
        </div>
        <button type="submit">移动零</button>
      </form>
      
      {resultArray.length > 0 && (
        <div className="result">
          <h3>结果：</h3>
          <p>[{resultArray.join(', ')}]</p>
        </div>
      )}
    </div>
  );
};

export default MoveZeroes; 