import React from 'react';
import './StepDescription.css';

interface StepDescriptionProps {
  action: 'init' | 'compare' | 'swap' | 'move' | 'complete';
  description: string;
}

const StepDescription: React.FC<StepDescriptionProps> = ({ action, description }) => {
  const getActionLabel = () => {
    switch (action) {
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
        <span className={`action-tag ${action}`}>{getActionLabel()}</span>
      </div>
      <p className="description-text">{description}</p>
    </div>
  );
};

export default StepDescription; 