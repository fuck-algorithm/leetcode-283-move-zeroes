/**
 * 进度条组件
 * 显示播放进度，支持拖拽跳转
 * Requirements: 7.11, 7.12, 7.13
 */

import React, { useState } from 'react';
import { ProgressBarProps } from '../../types';
import { PROGRESS_COLORS } from '../../utils/colorScheme';
import './ProgressBar.css';

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  onSeek,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // 计算进度百分比
  const safeTotalSteps = Math.max(0, Math.floor(totalSteps));
  const safeCurrentStep = safeTotalSteps > 0
    ? Math.max(0, Math.min(Math.floor(currentStep), safeTotalSteps - 1))
    : 0;
  const progress = safeTotalSteps > 1
    ? (safeCurrentStep / (safeTotalSteps - 1)) * 100
    : 0;

  const getStepFromPosition = (clientX: number, rect: DOMRect) => {
    if (safeTotalSteps <= 1 || rect.width <= 0) return 0;
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(percentage * (safeTotalSteps - 1));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    if (event.pointerId !== undefined) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setIsDragging(true);
    onSeek(getStepFromPosition(event.clientX, event.currentTarget.getBoundingClientRect()));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    onSeek(getStepFromPosition(event.clientX, event.currentTarget.getBoundingClientRect()));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      isDragging &&
      event.pointerId !== undefined &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let nextStep = safeCurrentStep;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextStep += 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextStep -= 1;
    else if (event.key === 'Home') nextStep = 0;
    else if (event.key === 'End') nextStep = safeTotalSteps - 1;
    else return;

    event.preventDefault();
    onSeek(Math.max(0, Math.min(nextStep, safeTotalSteps - 1)));
  };

  return (
    <div className="progress-bar-container">
      <div
        aria-label="演示步骤进度"
        aria-valuemax={Math.max(0, safeTotalSteps - 1)}
        aria-valuemin={0}
        aria-valuenow={safeCurrentStep}
        aria-valuetext={`步骤 ${safeTotalSteps ? safeCurrentStep + 1 : 0} / ${safeTotalSteps}`}
        className={`progress-bar ${isDragging ? 'dragging' : ''}`}
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        tabIndex={0}
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
          {Array.from({ length: safeTotalSteps }).map((_, index) => {
            const markerProgress = safeTotalSteps > 1
              ? (index / (safeTotalSteps - 1)) * 100
              : 0;
            return (
              <div
                key={index}
                className={`progress-marker ${index <= safeCurrentStep ? 'passed' : ''}`}
                style={{ left: `${markerProgress}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* 步骤信息 */}
      <div className="progress-info">
        <span className="progress-current">步骤 {safeTotalSteps ? safeCurrentStep + 1 : 0}</span>
        <span className="progress-total">/ {safeTotalSteps}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
