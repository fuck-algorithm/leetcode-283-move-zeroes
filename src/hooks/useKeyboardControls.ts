/**
 * 键盘控制 Hook
 * 监听键盘事件，控制算法播放
 * Requirements: 7.5, 7.6, 7.7, 7.8
 */

import { useEffect, useCallback } from 'react';

interface KeyboardControlsConfig {
  onStepForward: () => void;
  onStepBackward: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  enabled?: boolean;
}

export function useKeyboardControls({
  onStepForward,
  onStepBackward,
  onTogglePlay,
  onReset,
  enabled = true,
}: KeyboardControlsConfig): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // 忽略在输入框中的按键
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          onStepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onStepBackward();
          break;
        case ' ':
          event.preventDefault();
          onTogglePlay();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          onReset();
          break;
        default:
          break;
      }
    },
    [enabled, onStepForward, onStepBackward, onTogglePlay, onReset]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useKeyboardControls;
