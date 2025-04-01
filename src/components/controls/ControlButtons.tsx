import React from 'react';
import './ControlButtons.css';

interface ControlButtonsProps {
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isPlaying,
  canStepForward,
  canStepBackward,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset
}) => {
  return (
    <div className="controls">
      <button onClick={onReset} className="control-button reset">
        <span className="button-icon">↺</span> 重置
      </button>
      <button 
        onClick={onStepBackward} 
        disabled={!canStepBackward}
        className="control-button prev"
      >
        <span className="button-icon">←</span> 上一步
      </button>
      {isPlaying ? (
        <button onClick={onPause} className="control-button pause">
          <span className="button-icon">⏸</span> 暂停
        </button>
      ) : (
        <button onClick={onPlay} className="control-button play">
          <span className="button-icon">▶</span> 播放
        </button>
      )}
      <button 
        onClick={onStepForward} 
        disabled={!canStepForward}
        className="control-button next"
      >
        <span className="button-icon">→</span> 下一步
      </button>
    </div>
  );
};

export default ControlButtons; 