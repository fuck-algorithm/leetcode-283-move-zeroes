import React, { useEffect, useState } from 'react';
import { useCustomTranslation } from '../../i18n';
import './VisualizationContainer.css';
import ArrayVisualizerD3Enhanced from './ArrayVisualizerD3Enhanced';
import { AlgorithmStepD3, generateAlgorithmStepsD3 } from '../../utils/algorithmStepsD3';
import StepDescription from './StepDescription';
import ControlButtons from '../controls/ControlButtons';
import ProgressStats from './ProgressStats';

/**
 * 可视化容器组件，负责展示算法的可视化过程
 */
interface VisualizationContainerProps {
  inputArray: number[];
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({ inputArray }) => {
  const { t } = useCustomTranslation();
  const [steps, setSteps] = useState<AlgorithmStepD3[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 当输入数组变化时，重新生成可视化步骤
  useEffect(() => {
    const newSteps = generateAlgorithmStepsD3(inputArray);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [inputArray]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // 自动播放效果
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 500); // 500 毫秒的间隔

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentStepIndex, steps.length]);

  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return <div>{t('visualization.loading')}</div>;
  }

  // 计算交换次数
  const calculateSwapCount = () => {
    return steps.filter(step => step.action === 'swap').length;
  };

  return (
    <div className="visualization-container">
      <div className="visualization-content">
        <div className="visualization-section">
          <ArrayVisualizerD3Enhanced
            step={currentStep}
            width={800}
            height={400}
          />
        </div>
        <div className="step-description-section">
          <StepDescription step={currentStep} />
        </div>
        <div className="control-section">
          <ControlButtons
            isPlaying={isPlaying}
            canStepBackward={currentStepIndex > 0}
            canStepForward={currentStepIndex < steps.length - 1}
            onReset={handleReset}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
          />
          <ProgressStats
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            swapCount={calculateSwapCount()}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizationContainer; 