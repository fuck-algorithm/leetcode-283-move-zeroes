import React, { useState } from 'react';
import './VisualizerControls.css';

// 预设示例
const PRESETS = [
  { name: 'LeetCode示例1', array: [0, 1, 0, 3, 12] },
  { name: 'LeetCode示例2', array: [0, 0, 1] },
  { name: '全是零', array: [0, 0, 0, 0, 0] },
  { name: '无零数组', array: [1, 2, 3, 4, 5] },
  { name: '零在末尾', array: [1, 2, 3, 4, 0, 0] },
  { name: '较长数组', array: [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0] },
];

interface VisualizerControlsProps {
  onArrayChange: (array: number[]) => void;
  onSpeedChange: (speed: number) => void;
}

const VisualizerControls: React.FC<VisualizerControlsProps> = ({ onArrayChange, onSpeedChange }) => {
  const [inputArray, setInputArray] = useState<string>('0,1,0,3,12');
  const [speed, setSpeed] = useState<number>(1);
  const [error, setError] = useState<string>('');
  
  // 处理数组输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputArray(e.target.value);
    setError('');
  };
  
  // 处理速度变化
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };
  
  // 应用数组
  const applyArray = () => {
    try {
      // 验证并转换输入
      const array = inputArray
        .split(',')
        .map(item => {
          const num = parseInt(item.trim(), 10);
          if (isNaN(num)) {
            throw new Error('包含非数字值');
          }
          return num;
        });
      
      if (array.length === 0) {
        setError('数组不能为空');
        return;
      }
      
      if (array.length > 20) {
        setError('数组长度不能超过20');
        return;
      }
      
      onArrayChange(array);
      setError('');
    } catch (err) {
      setError('请输入有效的数组，例如：0,1,0,3,12');
    }
  };
  
  // 应用预设
  const applyPreset = (preset: { name: string; array: number[] }) => {
    setInputArray(preset.array.join(','));
    onArrayChange(preset.array);
    setError('');
  };
  
  // 生成随机数组
  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 10) + 5; // 5-15个元素
    const array = [];
    
    for (let i = 0; i < length; i++) {
      // 50%的概率生成0
      const value = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 20) + 1;
      array.push(value);
    }
    
    setInputArray(array.join(','));
    onArrayChange(array);
    setError('');
  };
  
  return (
    <div className="visualizer-controls">
      <div className="controls-layout">
        <div className="input-section">
          <div className="input-with-button">
            <input
              type="text"
              value={inputArray}
              onChange={handleInputChange}
              placeholder="输入数组，例如：0,1,0,3,12"
            />
            <button onClick={applyArray}>应用</button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <div className="speed-and-presets">
          <div className="speed-control">
            <label>
              速度: {speed.toFixed(1)}x
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={speed}
                onChange={handleSpeedChange}
              />
            </label>
          </div>
          
          <div className="preset-buttons">
            {PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="preset-button"
              >
                {preset.name}
              </button>
            ))}
            <button
              onClick={generateRandomArray}
              className="preset-button random"
            >
              随机
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerControls; 