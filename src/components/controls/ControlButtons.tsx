import React from 'react';
import './ControlButtons.css';
import { useCustomTranslation } from '../../i18n';

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
  const { t } = useCustomTranslation();
  
  return (
    <div className="controls">
      <button onClick={onReset} className="control-button reset">
        <span className="button-icon">↺</span> {t('controls.reset')} <span className="shortcut-hint">({t('controls.shortcuts.rKey')})</span>
      </button>
      <button 
        onClick={onStepBackward} 
        disabled={!canStepBackward}
        className="control-button prev"
      >
        <span className="button-icon">←</span> {t('controls.previous')} <span className="shortcut-hint">({t('controls.shortcuts.leftArrow')})</span>
      </button>
      {isPlaying ? (
        <button onClick={onPause} className="control-button pause">
          <span className="button-icon">⏸</span> {t('controls.pause')} <span className="shortcut-hint">({t('controls.shortcuts.spaceKey')})</span>
        </button>
      ) : (
        <button onClick={onPlay} className="control-button play">
          <span className="button-icon">▶</span> {t('controls.start')} <span className="shortcut-hint">({t('controls.shortcuts.spaceKey')})</span>
        </button>
      )}
      <button 
        onClick={onStepForward} 
        disabled={!canStepForward}
        className="control-button next"
      >
        <span className="button-icon">→</span> {t('controls.next')} <span className="shortcut-hint">({t('controls.shortcuts.rightArrow')})</span>
      </button>
    </div>
  );
};

export default ControlButtons; 