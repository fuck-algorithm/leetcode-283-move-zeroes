import React from 'react';
import './ProgressStats.css';
import { useCustomTranslation } from '../../i18n';

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
  const { t } = useCustomTranslation();
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
          <span>{t('visualization.swapCount')}: {swapCount}</span>
        </div>
        <div className="statistic">
          <span>{t('visualization.step')}: {currentStep + 1} {t('visualization.of')} {totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats; 