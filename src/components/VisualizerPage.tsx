import React, { useState } from 'react';
import { useCustomTranslation } from '../i18n';
import VisualizerControls from './VisualizerControls';
import VisualizationContainer from './visualization/VisualizationContainer';
import './VisualizerPage.css';

const VisualizerPage: React.FC = () => {
  const { t, i18n } = useCustomTranslation();
  const [array, setArray] = useState<number[]>([0, 1, 0, 3, 12]);
  
  // 处理数组变化
  const handleArrayChange = (newArray: number[]) => {
    setArray(newArray);
  };
  
  // 处理速度变化
  const handleSpeedChange = (newSpeed: number) => {
    // 暂时不使用速度控制
  };
  
  // 根据当前语言决定链接地址
  const getLeetCodeUrl = () => {
    return i18n.language.startsWith('zh') 
      ? 'https://leetcode.cn/problems/move-zeroes/description/'
      : 'https://leetcode.com/problems/move-zeroes/description/';
  };
  
  return (
    <div className="visualizer-page">
      <div className="page-header">
        <a 
          href={getLeetCodeUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="leetcode-link"
        >
          <h1>{t('app.description')}</h1>
        </a>
      </div>
      
      <div className="main-content">
        <VisualizerControls 
          onArrayChange={handleArrayChange}
          onSpeedChange={handleSpeedChange}
        />
        
        <VisualizationContainer 
          inputArray={array}
        />
      </div>
    </div>
  );
};

export default VisualizerPage; 