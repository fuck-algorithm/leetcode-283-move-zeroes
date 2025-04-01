import React from 'react';
import './ProgressStats.css';

interface ProgressStatsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="progress-stats">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        步骤 {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
};

export default ProgressStats; 