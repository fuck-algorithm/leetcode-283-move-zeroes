import React from 'react';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';
import './StepDescription.css';

interface StepDescriptionProps {
  step: AlgorithmStepD3;
}

const StepDescription: React.FC<StepDescriptionProps> = ({ step }) => {
  const getActionLabel = (action: string) => {
    switch (action) {
      case 'init':
        return '初始化';
      case 'compare':
        return '比较';
      case 'move':
        return '移动';
      case 'swap':
        return '交换';
      case 'complete':
        return '完成';
      default:
        return action;
    }
  };

  return (
    <div className="step-description">
      <div className="step-action">
        {getActionLabel(step.action)}
      </div>
      <div className="step-message">
        {step.message}
      </div>
    </div>
  );
};

export default StepDescription; 