/**
 * 进度条组件
 * 显示播放进度，支持拖拽跳转
 * Requirements: 7.11, 7.12, 7.13
 */

import React, { useRef, useState, useCallback } from 'react';
import { ProgressBarProps } from '../../types';
import { PROGRESS_COLORS } from '../../utils/colorScheme';
import './ProgressBar.css';

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  onSeek,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 计算进度百分比
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  // 根据点击/拖拽位置计算步骤
  const calculateStepFromPosition = useCallback(
    (clientX: number) => {
      if (!barRef.current) return currentStep;

      const rect = barRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const step = Math.round(percentage * (totalSteps - 1));

      return step;
    },
    [currentStep, totalSteps]
  );

  // 处理点击
  const handleClick = (e: React.MouseEvent) => {
    const step = calculateStepFromPosition(e.clientX);
    onSeek(step);
  };

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const step = calculateStepFromPosition(moveEvent.clientX);
      onSeek(step);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="progress-bar-container">
      <div
        ref={barRef}
        className={`progress-bar ${isDragging ? 'dragging' : ''}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        {/* 背景轨道 */}
        <div
          className="progress-track"
          style={{ backgroundColor: PROGRESS_COLORS.unplayed }}
        />

        {/* 已播放部分 */}
        <div
          className="progress-played"
          style={{
            width: `${progress}%`,
            backgroundColor: PROGRESS_COLORS.played,
          }}
        />

        {/* 拖动手柄 */}
        <div
          className="progress-handle"
          style={{
            left: `${progress}%`,
            backgroundColor: PROGRESS_COLORS.handle,
          }}
        />

        {/* 步骤标记点 */}
        <div className="progress-markers">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const markerProgress = totalSteps > 1 ? (index / (totalSteps - 1)) * 100 : 0;
            return (
              <div
                key={index}
                className={`progress-marker ${index <= currentStep ? 'passed' : ''}`}
                style={{ left: `${markerProgress}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* 步骤信息 */}
      <div className="progress-info">
        <span className="progress-current">步骤 {currentStep + 1}</span>
        <span className="progress-total">/ {totalSteps}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
