import React, { useState, useEffect } from 'react';
import ArrayVisualizerD3Enhanced from './ArrayVisualizerD3Enhanced';
import StepDescription from './StepDescription';
import ControlButtons from '../controls/ControlButtons';
import ProgressStats from '../controls/ProgressStats';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';
import { generateAlgorithmStepsD3 } from '../../utils/algorithmStepsD3';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import './VisualizationContainer.css';

interface VisualizationContainerProps {
  inputArray: number[];
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({ inputArray }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<AlgorithmStepD3[]>([]);

  useEffect(() => {
    const newSteps = generateAlgorithmStepsD3(inputArray);
    setSteps(newSteps);
  }, [inputArray]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  useKeyboardControls({
    onPlay: handlePlay,
    onPause: handlePause,
    onReset: handleReset,
    onStepForward: handleStepForward,
    onStepBackward: handleStepBackward,
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalId = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length]);

  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return <div>加载中...</div>;
  }

  return (
    <div className="visualization-container">
      <div className="visualization-header">
        <h2>可视化演示</h2>
      </div>
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
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizationContainer; 