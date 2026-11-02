/**
 * 算法可视化主页面组件
 * 整合所有子组件，实现完整的可视化体验
 * Requirements: 10.3, 9.1, 9.4
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage } from '../types';
import { useAlgorithmState } from '../hooks/useAlgorithmState';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useLanguagePreference, usePlaybackSpeed } from '../hooks/useIndexedDB';

// Header components
import TitleBar from './header/TitleBar';
import GitHubBadge from './header/GitHubBadge';
import AlgorithmExplanation from './header/AlgorithmExplanation';
import DataInput from './header/DataInput';
import ProblemDescription from './header/ProblemDescription';

// Code components
import CodeDisplay from './code/CodeDisplay';

// Canvas components
import D3Canvas from './canvas/D3Canvas';

// Control components
import ControlPanel from './controls/ControlPanel';
import ProgressBar from './controls/ProgressBar';

// Float components
import WeChatFloat from './float/WeChatFloat';
import LanguageSwitcher from './LanguageSwitcher';
import { useCustomTranslation } from '../i18n';

import './AlgorithmVisualizerPage.css';

const DEFAULT_ARRAY = [0, 1, 0, 3, 12];

const AlgorithmVisualizerPage: React.FC = () => {
  // 编程语言偏好
  const { language, setLanguage } = useLanguagePreference();
  const { i18n } = useCustomTranslation();
  
  // 播放速度偏好
  const { speed: savedSpeed, setSpeed: saveSpeed } = usePlaybackSpeed();

  // 算法状态
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    speed,
    inputArray,
    setInputArray,
    stepForward,
    stepBackward,
    play,
    pause,
    togglePlay,
    reset,
    seekTo,
    setSpeed,
    canStepForward,
    canStepBackward,
  } = useAlgorithmState(DEFAULT_ARRAY, savedSpeed);

  // 算法思路弹窗状态
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // 画布尺寸由容器观察器实时测量
  const canvasHostRef = React.useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });

  // 同步速度到持久化存储
  useEffect(() => {
    if (speed !== savedSpeed) {
      saveSpeed(speed);
    }
  }, [speed, savedSpeed, saveSpeed]);

  // 键盘控制
  useKeyboardControls({
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onTogglePlay: togglePlay,
    onReset: reset,
  });

  // 处理语言切换
  const handleLanguageChange = useCallback((lang: SupportedLanguage) => {
    setLanguage(lang);
  }, [setLanguage]);

  // 处理速度变化
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    saveSpeed(newSpeed);
  }, [setSpeed, saveSpeed]);

  // 观察画布容器尺寸，响应布局变化和侧栏切换
  useEffect(() => {
    const container = canvasHostRef.current;
    if (!container) return;

    const updateCanvasSize = (width: number, height: number) => {
      setCanvasSize({
        width: Math.max(1, width),
        height: Math.max(1, height),
      });
    };

    const initialRect = container.getBoundingClientRect();
    updateCanvasSize(initialRect.width, initialRect.height);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(([entry]) => {
        updateCanvasSize(entry.contentRect.width, entry.contentRect.height);
      });
      observer.observe(container);
      return () => observer.disconnect();
    }

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      updateCanvasSize(rect.width, rect.height);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="algorithm-visualizer-page">
      {/* 头部区域 */}
      <header className="header-section">
        <div className="header-top">
          <a
            href="https://fuck-algorithm.github.io/leetcode-hot-100/"
            target="_blank"
            rel="noopener noreferrer"
            className="back-link"
          >
            ← 返回 LeetCode Hot 100
          </a>

          <TitleBar
            problemNumber={283}
            problemTitle={i18n.language.startsWith('zh') ? '移动零' : 'Move Zeroes'}
            leetCodeUrl="https://leetcode.cn/problems/move-zeroes/"
          />

          <div className="header-actions">
            <ProblemDescription />
            <button
              className="explanation-btn"
              onClick={() => setIsExplanationOpen(true)}
            >
              算法思路
            </button>
            <LanguageSwitcher />
            <GitHubBadge
              repoUrl="https://github.com/fuck-algorithm/leetcode-283-move-zeroes"
              owner="fuck-algorithm"
              repo="leetcode-283-move-zeroes"
            />
          </div>
        </div>

        <DataInput
          initialArray={inputArray}
          onArrayChange={setInputArray}
        />
      </header>

      {/* 主内容区域 */}
      <main className="main-section">
        {/* 代码展示 */}
        <aside className="code-section">
          <CodeDisplay
            language={language}
            currentStep={currentStep}
            onLanguageChange={handleLanguageChange}
          />
        </aside>

        {/* 画布区域 */}
        <section className="canvas-section" ref={canvasHostRef}>
          <D3Canvas
            step={currentStep}
            width={canvasSize.width}
            height={canvasSize.height}
          />
        </section>
      </main>

      {/* 控制区域 */}
      <footer className="control-section">
        <ControlPanel
          isPlaying={isPlaying}
          canStepBackward={canStepBackward}
          canStepForward={canStepForward}
          speed={speed}
          onPlay={play}
          onPause={pause}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={reset}
          onSpeedChange={handleSpeedChange}
        />
        <div className="progress-section">
          <ProgressBar
            currentStep={currentStepIndex}
            totalSteps={totalSteps}
            onSeek={seekTo}
          />
        </div>
      </footer>

      {/* 悬浮组件 */}
      <WeChatFloat />

      {/* 算法思路弹窗 */}
      <AlgorithmExplanation
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
      />
    </div>
  );
};

export default AlgorithmVisualizerPage;
