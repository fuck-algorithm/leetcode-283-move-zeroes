import React from 'react';
import './ProgressStats.css';

interface ProgressStatsProps {
  currentStep: number;
  totalSteps: number;
  swapCount: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ 
  currentStep, 
  totalSteps, 
  swapCount 
}) => {
  const progressPercentage = totalSteps > 0 
    ? Math.floor(((currentStep + 1) / totalSteps) * 100) 
    : 0;

  return (
    <div className="progress-stats">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="statistics">
        <div className="statistic">
          <span>交换次数: {swapCount}</span>
        </div>
        <div className="statistic">
          <span>步骤: {currentStep + 1}/{totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats; 