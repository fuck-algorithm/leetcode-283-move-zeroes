import React, { useEffect, useState, useCallback } from 'react';
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
  speed?: number; // 添加速度参数
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({ 
  inputArray,
  speed = 1.0 // 默认速度为1.0x
}) => {
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

  // 使用useCallback缓存控制函数，避免在每次渲染时重新创建
  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  
  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  // 键盘快捷键处理函数
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 如果用户正在文本输入框中输入，则不触发快捷键
    if (
      document.activeElement &&
      (document.activeElement.tagName === 'INPUT' || 
       document.activeElement.tagName === 'TEXTAREA')
    ) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case 'r': // 按R键重置
        handleReset();
        console.log('快捷键: R - 重置');
        break;
      case ' ': // 空格键切换播放/暂停
        event.preventDefault(); // 防止页面滚动
        handleTogglePlay();
        console.log(`快捷键: 空格 - ${isPlaying ? '暂停' : '播放'}`);
        break;
      case 'arrowleft': // 左方向键后退一步
        event.preventDefault();
        handleStepBackward();
        console.log('快捷键: ← - 上一步');
        break;
      case 'arrowright': // 右方向键前进一步
        event.preventDefault();
        handleStepForward();
        console.log('快捷键: → - 下一步');
        break;
      default:
        break;
    }
  }, [handleReset, handleTogglePlay, isPlaying, handleStepBackward, handleStepForward]);

  // 添加键盘事件监听器
  useEffect(() => {
    // 添加全局键盘事件监听
    window.addEventListener('keydown', handleKeyDown);
    
    // 清理函数，组件卸载时移除事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 自动播放效果 - 考虑速度参数
  useEffect(() => {
    if (!isPlaying) return;

    // 根据速度调整动画间隔
    const baseInterval = 500; // 基础间隔时间为500毫秒
    const actualInterval = baseInterval / speed; // 速度越大，间隔越短

    console.log(`自动播放速度: ${speed}x, 播放间隔: ${actualInterval}ms`);
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, actualInterval);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

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