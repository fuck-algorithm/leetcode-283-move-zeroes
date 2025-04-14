import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../i18n';
import './VisualizerControls.css';

// 本地存储键名
const SPEED_STORAGE_KEY = 'visualization_speed';

// 预设示例
const PRESETS = [
  { name: 'presets.example1', array: [0, 1, 0, 3, 12] },
  { name: 'presets.example2', array: [0] },
  { name: 'presets.allZeros', array: [0, 0, 0, 0, 0] },
  { name: 'presets.noZeros', array: [1, 2, 3, 4, 5] },
  { name: 'presets.zerosAtEnd', array: [1, 2, 3, 4, 0, 0] },
  { name: 'presets.longArray', array: [
    0, 5, 0, 7, 9, 0, 1, 0, 8, 0, 
    2, 0, 3, 0, 10, 0, 4, 6, 0, 11, 
    0, 15, 0, 17, 0, 12, 0, 13, 0, 19, 
    0, 20, 0, 22, 0, 16, 0, 14, 0, 18, 
    21, 0, 25, 0, 23, 0, 24, 0, 26, 0
  ] }, // 50个元素的长数组，包含25个零
];

interface VisualizerControlsProps {
  onArrayChange: (array: number[]) => void;
  onSpeedChange: (speed: number) => void;
}

const VisualizerControls: React.FC<VisualizerControlsProps> = ({ onArrayChange, onSpeedChange }) => {
  const { t } = useCustomTranslation();
  const [inputArray, setInputArray] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // 从localStorage读取之前保存的速度值或使用默认值1.0
  const [speed, setSpeed] = useState<number>(() => {
    try {
      const savedSpeed = localStorage.getItem(SPEED_STORAGE_KEY);
      return savedSpeed ? parseFloat(savedSpeed) : 1.0;
    } catch (e) {
      console.error('Error reading speed from localStorage:', e);
      return 1.0;
    }
  });
  
  // 生成随机数组
  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 50) + 1; // 1-50个元素
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
  
  // 组件初始化时生成随机数据并设置初始速度
  useEffect(() => {
    generateRandomArray();
    // 初始化时将保存的速度值传递给父组件
    onSpeedChange(speed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
    
    // 保存到localStorage
    try {
      localStorage.setItem(SPEED_STORAGE_KEY, newSpeed.toString());
    } catch (e) {
      console.error('Error saving speed to localStorage:', e);
    }
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
            throw new Error(t('errors.nonNumeric'));
          }
          return num;
        });
      
      if (array.length === 0) {
        setError(t('errors.emptyArray'));
        return;
      }
      
      if (array.length > 100) {
        setError(t('errors.tooLarge'));
        return;
      }
      
      onArrayChange(array);
      setError('');
    } catch (err) {
      setError(t('errors.invalidInput'));
    }
  };
  
  // 应用预设
  const applyPreset = (preset: { name: string; array: number[] }) => {
    setInputArray(preset.array.join(','));
    onArrayChange(preset.array);
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
              placeholder={t('controls.inputPlaceholder')}
            />
            <button onClick={applyArray}>{t('controls.apply')}</button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <div className="speed-and-presets">
          <div className="speed-control">
            <label>
              {t('controls.speed')}: {speed.toFixed(1)}x
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
                {t(preset.name)}
              </button>
            ))}
            <button
              onClick={generateRandomArray}
              className="preset-button random"
            >
              {t('controls.random')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerControls; 