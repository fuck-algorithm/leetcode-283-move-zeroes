/**
 * 算法状态管理 Hook
 * 管理当前步骤、播放状态、速度等
 * Requirements: 7.5, 7.6, 7.7, 7.8
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { AlgorithmStep } from '../types';
import { generateSteps } from '../utils/stepGenerator';

interface UseAlgorithmStateReturn {
  // 状态
  steps: AlgorithmStep[];
  currentStepIndex: number;
  currentStep: AlgorithmStep | null;
  isPlaying: boolean;
  speed: number;
  inputArray: number[];

  // 控制方法
  setInputArray: (array: number[]) => void;
  stepForward: () => void;
  stepBackward: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  reset: () => void;
  seekTo: (stepIndex: number) => void;
  setSpeed: (speed: number) => void;

  // 状态检查
  canStepForward: boolean;
  canStepBackward: boolean;
  totalSteps: number;
}

const DEFAULT_ARRAY = [0, 1, 0, 3, 12];
const DEFAULT_SPEED = 1.0;

export function useAlgorithmState(
  initialArray: number[] = DEFAULT_ARRAY,
  initialSpeed: number = DEFAULT_SPEED
): UseAlgorithmStateReturn {
  const [inputArray, setInputArrayState] = useState<number[]>(initialArray);
  const [steps, setSteps] = useState<AlgorithmStep[]>(() => generateSteps(initialArray));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(initialSpeed);

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 当输入数组变化时，重新生成步骤
  const setInputArray = useCallback((array: number[]) => {
    setInputArrayState(array);
    const newSteps = generateSteps(array);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // 前进一步
  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  // 后退一步
  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // 播放
  const play = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      // 如果已经在最后一步，从头开始
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  // 暂停
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // 切换播放/暂停
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // 重置
  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // 跳转到指定步骤
  const seekTo = useCallback((stepIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
    setCurrentStepIndex(clampedIndex);
  }, [steps.length]);

  // 设置速度
  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
  }, []);

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying) {
      const interval = 1000 / speed; // 基础间隔 1 秒，根据速度调整

      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, speed, steps.length]);

  // 计算派生状态
  const currentStep = steps[currentStepIndex] || null;
  const canStepForward = currentStepIndex < steps.length - 1;
  const canStepBackward = currentStepIndex > 0;
  const totalSteps = steps.length;

  return {
    // 状态
    steps,
    currentStepIndex,
    currentStep,
    isPlaying,
    speed,
    inputArray,

    // 控制方法
    setInputArray,
    stepForward,
    stepBackward,
    play,
    pause,
    togglePlay,
    reset,
    seekTo,
    setSpeed,

    // 状态检查
    canStepForward,
    canStepBackward,
    totalSteps,
  };
}

export default useAlgorithmState;
