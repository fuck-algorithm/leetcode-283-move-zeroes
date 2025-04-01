import React from 'react';
import './StepDescription.css';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';

interface StepDescriptionProps {
  step: AlgorithmStepD3;
}

const StepDescription: React.FC<StepDescriptionProps> = ({ step }) => {
  const getActionLabel = () => {
    switch (step.action) {
      case 'swap':
        return '交换元素';
      case 'compare':
        return '比较元素';
      case 'move':
        return '移动指针';
      case 'init':
        return '初始化';
      case 'complete':
        return '完成';
      default:
        return '';
    }
  };

  return (
    <div className="step-explanation">
      <div className="current-action">
        <span className={`action-tag ${step.action}`}>{getActionLabel()}</span>
      </div>
      <p className="description-text">{step.message || ''}</p>
    </div>
  );
};

export default StepDescription; 