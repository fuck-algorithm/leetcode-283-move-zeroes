/**
 * 速度选择器组件
 * 自定义下拉菜单选择播放速度
 * Requirements: 7.9, 7.10
 */

import React, { useState, useRef, useEffect } from 'react';
import './SpeedSelector.css';

interface SpeedSelectorProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1.0, label: '1.0x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2.0x' },
  { value: 3.0, label: '3.0x' },
];

const SpeedSelector: React.FC<SpeedSelectorProps> = ({
  speed,
  onSpeedChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: number) => {
    onSpeedChange(value);
    setIsOpen(false);
  };

  const currentLabel = SPEED_OPTIONS.find(opt => opt.value === speed)?.label || `${speed}x`;

  return (
    <div className="speed-selector" ref={containerRef}>
      <button
        className="speed-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="speed-icon">⚡</span>
        <span className="speed-value">{currentLabel}</span>
        <span className={`speed-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className="speed-dropdown" role="listbox">
          {SPEED_OPTIONS.map((option) => (
            <li
              key={option.value}
              className={`speed-option ${speed === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={speed === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpeedSelector;
