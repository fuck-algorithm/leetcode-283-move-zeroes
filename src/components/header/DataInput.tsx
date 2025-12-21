/**
 * 数据输入组件
 * 支持自定义输入、预设样例和随机生成
 * Requirements: 4.1, 4.2, 4.3, 4.6, 4.7, 4.8, 4.9
 */

import React, { useState, useCallback } from 'react';
import { DataInputProps } from '../../types';
import { 
  validateInput, 
  generateRandomArray, 
  formatArrayForInput,
  PRESET_EXAMPLES 
} from '../../services/ValidationService';
import './DataInput.css';

const DataInput: React.FC<DataInputProps> = ({
  onArrayChange,
  initialArray,
}) => {
  const [inputValue, setInputValue] = useState(formatArrayForInput(initialArray));
  const [error, setError] = useState<string | null>(null);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError(null);
  };

  // 处理输入提交
  const handleSubmit = useCallback(() => {
    const result = validateInput(inputValue);
    
    if (!result.isValid) {
      setError(result.error || '输入无效');
      return;
    }

    setError(null);
    onArrayChange(result.sanitizedValue!);
  }, [inputValue, onArrayChange]);

  // 处理回车键提交
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 选择预设样例
  const handlePresetClick = (data: number[]) => {
    setInputValue(formatArrayForInput(data));
    setError(null);
    onArrayChange(data);
  };

  // 随机生成数据
  const handleRandomGenerate = () => {
    const randomArray = generateRandomArray();
    setInputValue(formatArrayForInput(randomArray));
    setError(null);
    onArrayChange(randomArray);
  };

  return (
    <div className="data-input">
      <div className="input-row">
        <label className="input-label">输入数组：</label>
        <input
          type="text"
          className={`input-field ${error ? 'input-error' : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="输入逗号分隔的整数，如: 0,1,0,3,12"
        />
        <button 
          className="submit-btn"
          onClick={handleSubmit}
        >
          确定
        </button>
        <button 
          className="random-btn"
          onClick={handleRandomGenerate}
        >
          随机生成
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="preset-row">
        <span className="preset-label">预设样例：</span>
        <div className="preset-buttons">
          {PRESET_EXAMPLES.map((example, index) => (
            <button
              key={index}
              className="preset-btn"
              onClick={() => handlePresetClick(example.data)}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataInput;
