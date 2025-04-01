import React, { useState, useEffect, useRef } from 'react';
import './VisualizationContainer.css';

// 导入通用工具和接口
import { AlgorithmStep } from '../../utils/algorithmSteps';
import { AlgorithmStepD3, generateStepsD3 } from '../../utils/algorithmStepsD3';

// 导入子组件
// import ArrayVisualizer from './ArrayVisualizer';
// import ArrayVisualizerD3 from './ArrayVisualizerD3';
import ArrayVisualizerD3Enhanced from './ArrayVisualizerD3Enhanced';
import StepDescription from './StepDescription';
import ProgressStats from './ProgressStats';
import ControlButtons from '../controls/ControlButtons';
// import CodeDisplay from '../code/CodeDisplay';
import CodeDisplayD3 from '../code/CodeDisplayD3';
import AlgorithmExplanation from '../code/AlgorithmExplanation';
import UserGuide from './UserGuide';

interface VisualizationContainerProps {
  initialArray: number[];
  speed: number;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({ 
  initialArray, 
  speed 
}) => {
  // 状态
  const [steps, setSteps] = useState<AlgorithmStepD3[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [swapCount, setSwapCount] = useState<number>(0);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  
  // 计时器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 生成算法步骤
  useEffect(() => {
    if (initialArray?.length) {
      const algorithmSteps = generateStepsD3([...initialArray]);
      setSteps(algorithmSteps);
      setCurrentStepIndex(-1);
      setSwapCount(0);
      stopAnimation();
    }
  }, [initialArray]);
  
  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ': // 空格键
          e.preventDefault();
          isPlaying ? stopAnimation() : startAnimation();
          break;
        case 'ArrowRight': // 右箭头
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft': // 左箭头
          e.preventDefault();
          stepBackward();
          break;
        case 'r': // R键
        case 'R':
          e.preventDefault();
          resetAnimation();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, currentStepIndex, steps.length]);
  
  // 控制动画播放
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        const nextStep = currentStepIndex + 1;
        setCurrentStepIndex(nextStep);
        
        // 更新交换计数
        if (steps[nextStep]?.action === 'swap' && steps[nextStep]?.swapped) {
          setSwapCount(prev => prev + 1);
        }
        
        // 到达最后一步时停止
        if (nextStep >= steps.length - 1) {
          setIsPlaying(false);
        }
      }, 3000 / speed); // 速度调节
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps, speed]);
  
  // 开始动画
  const startAnimation = () => {
    if (currentStepIndex >= steps.length - 1) {
      // 如果到达结尾，重新开始
      setCurrentStepIndex(-1);
    }
    setIsPlaying(true);
    setShowGuide(false);
  };
  
  // 停止动画
  const stopAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // 步进控制
  const stepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      setShowGuide(false);
      
      // 更新交换计数
      if (steps[nextStep]?.action === 'swap' && steps[nextStep]?.swapped) {
        setSwapCount(prev => prev + 1);
      }
    }
  };
  
  const stepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  // 重置动画
  const resetAnimation = () => {
    stopAnimation();
    setCurrentStepIndex(-1);
    setSwapCount(0);
    setShowGuide(true);
  };
  
  // 获取当前步骤
  const currentStep = steps[currentStepIndex] || steps[0];
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : undefined;

  // 获取当前高亮行
  const getHighlightedLines = () => {
    if (currentStepIndex < 0 || !currentStep) return [];
    
    // 根据当前步骤返回需要高亮的代码行
    switch(currentStep.action) {
      case 'init':
        return [6, 7]; // 函数定义和双指针变量声明
      case 'compare':
        return [11, 12]; // 比较逻辑
      case 'move':
        return [13]; // 移动非零元素
      case 'swap':
        return [14]; // 交换元素
      case 'complete':
        return [23]; // 算法完成
      default:
        return [];
    }
  };

  return (
    <div className="algorithm-visualizer">
      <div className="compact-layout">
        {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}

        <div className="left-panel">
          <div className="visualization-section">
            <ArrayVisualizerD3Enhanced step={currentStep} prevStep={prevStep} />
            
            <StepDescription 
              action={currentStep?.action || 'init'} 
              description={currentStep?.description || '准备开始'} 
            />
            
            <ProgressStats 
              currentStep={currentStepIndex} 
              totalSteps={steps.length} 
              swapCount={swapCount} 
            />
          </div>
          
          <ControlButtons 
            isPlaying={isPlaying}
            canGoBack={currentStepIndex > 0}
            canGoForward={currentStepIndex < steps.length - 1}
            onReset={resetAnimation}
            onPrevious={stepBackward}
            onPlayPause={isPlaying ? stopAnimation : startAnimation}
            onNext={stepForward}
          />
        </div>
        
        <div className="right-panel">
          <div className="code-explanation-container">
            <CodeDisplayD3 
              currentStep={currentStepIndex} 
              highlightedLines={getHighlightedLines()}
              compactMode={true}
            />
            <AlgorithmExplanation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationContainer; 