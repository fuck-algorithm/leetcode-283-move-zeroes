import { useEffect } from 'react';

interface KeyboardControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const useKeyboardControls = ({
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
}: KeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ': // 空格键
          e.preventDefault();
          onPlay();
          break;
        case 'ArrowRight': // 右箭头
          e.preventDefault();
          onStepForward();
          break;
        case 'ArrowLeft': // 左箭头
          e.preventDefault();
          onStepBackward();
          break;
        case 'r': // R键
        case 'R':
          e.preventDefault();
          onReset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlay, onPause, onReset, onStepForward, onStepBackward]);
}; 