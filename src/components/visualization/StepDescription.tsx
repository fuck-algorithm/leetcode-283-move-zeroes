import React from 'react';
import './StepDescription.css';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';
import { useCustomTranslation } from '../../i18n';

interface StepDescriptionProps {
  step: AlgorithmStepD3;
}

const StepDescription: React.FC<StepDescriptionProps> = ({ step }) => {
  const { t, i18n } = useCustomTranslation();
  
  const getActionLabel = () => {
    switch (step.action) {
      case 'swap':
        return t('visualization.swap');
      case 'compare':
        return t('algorithm.compare') || '比较元素';
      case 'move':
        return t('visualization.movePointer');
      case 'init':
        return t('visualization.initialize');
      case 'complete':
        return t('visualization.complete');
      default:
        return '';
    }
  };

  // 手动处理步骤描述文本的国际化
  const getLocalizedMessage = () => {
    // 如果没有消息则返回空字符串
    if (!step.message) return '';
    
    // 检查是否是初始化步骤
    if (step.action === 'init') {
      return t('algorithmSteps.startMovingZeroes');
    }
    
    // 检查是否是完成步骤
    if (step.action === 'complete') {
      return t('algorithmSteps.zeroesMoveComplete');
    }
    
    // 检查是否是移动指针步骤
    if (step.action === 'move') {
      return t('algorithmSteps.movingPointers');
    }
    
    // 其他情况返回原始消息
    return step.message;
  };

  return (
    <div className="step-explanation">
      <div className="current-action">
        <span className={`action-tag ${step.action}`}>{getActionLabel()}</span>
      </div>
      <p className="description-text">{getLocalizedMessage()}</p>
    </div>
  );
};

export default StepDescription; 