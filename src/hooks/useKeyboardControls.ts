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

      const target = event.target as HTMLElement;
      if (target.isContentEditable || target.closest('input, textarea')) return;

      const interactiveTarget = target.closest('button, a, select, [role="slider"]');
      const sliderKey = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End']
        .includes(event.key);
      const shortcutKey = [
        'ArrowRight', 'ArrowLeft', ' ', 'r', 'R', 'Enter', 'Home', 'End',
      ].includes(event.key);
      const nativeActivationKey = event.key === ' ' || event.key === 'Enter';
      if (
        (interactiveTarget?.matches('select') && shortcutKey) ||
        (interactiveTarget?.matches('[role="slider"]') && sliderKey) ||
        (interactiveTarget?.matches('button, a') && nativeActivationKey)
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
