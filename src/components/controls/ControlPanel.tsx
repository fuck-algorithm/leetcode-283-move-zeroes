/**
 * 控制面板组件
 * 提供播放控制按钮和快捷键提示
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import React from 'react';
import { ControlPanelProps } from '../../types';
import SpeedSelector from './SpeedSelector';
import './ControlPanel.css';

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  canStepBackward,
  canStepForward,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
}) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="control-panel">
      <div className="control-buttons">
        {/* 上一步 */}
        <button
          className="control-btn"
          onClick={onStepBackward}
          disabled={!canStepBackward}
          title="上一步 (←)"
        >
          <span className="btn-icon">⏮</span>
          <span className="btn-label">上一步</span>
          <span className="btn-shortcut">←</span>
        </button>

        {/* 播放/暂停 */}
        <button
          className="control-btn control-btn-primary"
          onClick={handlePlayPause}
          title={isPlaying ? '暂停 (空格)' : '播放 (空格)'}
        >
          <span className="btn-icon">{isPlaying ? '⏸' : '▶'}</span>
          <span className="btn-label">{isPlaying ? '暂停' : '播放'}</span>
          <span className="btn-shortcut">空格</span>
        </button>

        {/* 下一步 */}
        <button
          className="control-btn"
          onClick={onStepForward}
          disabled={!canStepForward}
          title="下一步 (→)"
        >
          <span className="btn-icon">⏭</span>
          <span className="btn-label">下一步</span>
          <span className="btn-shortcut">→</span>
        </button>

        {/* 重置 */}
        <button
          className="control-btn control-btn-reset"
          onClick={onReset}
          title="重置 (R)"
        >
          <span className="btn-icon">↺</span>
          <span className="btn-label">重置</span>
          <span className="btn-shortcut">R</span>
        </button>

        {/* 速度选择器 */}
        <SpeedSelector
          speed={speed}
          onSpeedChange={onSpeedChange}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
