import React, { useState } from 'react';
import VisualizerControls from './VisualizerControls';
import VisualizationContainer from './visualization/VisualizationContainer';
import './VisualizerPage.css';

const VisualizerPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([0, 1, 0, 3, 12]);
  const [speed, setSpeed] = useState<number>(1);
  
  // 处理数组变化
  const handleArrayChange = (newArray: number[]) => {
    setArray(newArray);
  };
  
  // 处理速度变化
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };
  
  return (
    <div className="visualizer-page">
      <div className="page-header">
        <a 
          href="https://leetcode.cn/problems/move-zeroes/description/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="leetcode-link"
        >
          <h1>LeetCode 283 - 移动零算法可视化</h1>
        </a>
      </div>
      
      <div className="main-content">
        <VisualizerControls 
          onArrayChange={handleArrayChange}
          onSpeedChange={handleSpeedChange}
        />
        
        <VisualizationContainer 
          initialArray={array}
          speed={speed}
        />
      </div>
    </div>
  );
};

export default VisualizerPage; 