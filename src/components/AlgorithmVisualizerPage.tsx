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

// Code components
import CodeDisplay from './code/CodeDisplay';

// Canvas components
import D3Canvas from './canvas/D3Canvas';

// Control components
import ControlPanel from './controls/ControlPanel';
import ProgressBar from './controls/ProgressBar';

// Float components
import WeChatFloat from './float/WeChatFloat';

import './AlgorithmVisualizerPage.css';

const DEFAULT_ARRAY = [0, 1, 0, 3, 12];

const AlgorithmVisualizerPage: React.FC = () => {
  // 语言偏好
  const { language, setLanguage } = useLanguagePreference();
  
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

  // 画布尺寸
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

  // 监听窗口大小变化，更新画布尺寸
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.querySelector('.canvas-section');
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({
          width: rect.width - 32,
          height: rect.height - 32,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
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
            problemTitle="移动零"
            leetCodeUrl="https://leetcode.cn/problems/move-zeroes/"
          />

          <div className="header-actions">
            <button
              className="explanation-btn"
              onClick={() => setIsExplanationOpen(true)}
            >
              算法思路
            </button>
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
        <section className="canvas-section">
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
        <ProgressBar
          currentStep={currentStepIndex}
          totalSteps={totalSteps}
          onSeek={seekTo}
        />
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
