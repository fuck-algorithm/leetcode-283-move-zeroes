import React, { useState } from 'react';
import { useCustomTranslation } from './i18n';

/**
 * 实现 LeetCode 283. Move Zeroes
 * 给定一个数组，将所有的0移动到数组的末尾，同时保持非零元素的相对顺序。
 */
const MoveZeroes: React.FC = () => {
  const { t } = useCustomTranslation();
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
      alert(t('algorithm.inputError'));
    }
  };

  return (
    <div className="move-zeroes">
      <h2>{t('app.title')}</h2>
      <p>{t('algorithm.description')}</p>
      <p>{t('algorithm.note')}</p>
      <p>{t('algorithm.example')}</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="array-input">
            {t('algorithm.inputLabel')}：
          </label>
          <input
            id="array-input"
            type="text"
            value={inputArray}
            onChange={handleInputChange}
            placeholder={t('algorithm.inputPlaceholder')}
          />
        </div>
        <button type="submit">
          {t('algorithm.moveZeroesButton')}
        </button>
      </form>
      
      {resultArray.length > 0 && (
        <div className="result">
          <h3>{t('algorithm.resultTitle')}：</h3>
          <p>[{resultArray.join(', ')}]</p>
        </div>
      )}
    </div>
  );
};

export default MoveZeroes; 