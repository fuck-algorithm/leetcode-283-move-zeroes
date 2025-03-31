import React from 'react';
import './ControlButtons.css';

interface ControlButtonsProps {
  isPlaying: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onReset: () => void;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isPlaying,
  canGoBack,
  canGoForward,
  onReset,
  onPrevious,
  onPlayPause,
  onNext
}) => {
  return (
    <div className="controls">
      <button onClick={onReset} className="control-button reset">
        <span className="button-icon">↺</span> 重置
      </button>
      <button 
        onClick={onPrevious} 
        disabled={!canGoBack}
        className="control-button prev"
      >
        <span className="button-icon">←</span> 上一步
      </button>
      {isPlaying ? (
        <button onClick={onPlayPause} className="control-button pause">
          <span className="button-icon">⏸</span> 暂停
        </button>
      ) : (
        <button onClick={onPlayPause} className="control-button play">
          <span className="button-icon">▶</span> 播放
        </button>
      )}
      <button 
        onClick={onNext} 
        disabled={!canGoForward}
        className="control-button next"
      >
        <span className="button-icon">→</span> 下一步
      </button>
    </div>
  );
};

export default ControlButtons; 