/**
 * 算法思路弹窗组件
 * 展示双指针交换算法的解题思路
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import React, { useEffect, useCallback } from 'react';
import { AlgorithmExplanationProps } from '../../types';
import './AlgorithmExplanation.css';

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({
  isOpen,
  onClose,
}) => {
  // 处理 ESC 键关闭
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // 点击遮罩层关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="explanation-overlay" onClick={handleOverlayClick}>
      <div className="explanation-modal">
        <div className="explanation-header">
          <h2 className="explanation-title">算法思路</h2>
          <button 
            className="explanation-close"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        
        <div className="explanation-content">
          <h3>双指针交换法</h3>
          
          <div className="explanation-section">
            <h4>核心思想</h4>
            <p>
              使用两个指针 <code>slow</code> 和 <code>fast</code>，
              <code>slow</code> 指向下一个非零元素应该放置的位置，
              <code>fast</code> 用于遍历数组寻找非零元素。
            </p>
          </div>

          <div className="explanation-section">
            <h4>算法步骤</h4>
            <ol>
              <li>初始化 <code>slow = 0</code></li>
              <li>遍历数组，<code>fast</code> 从 0 到 n-1</li>
              <li>当 <code>nums[fast] ≠ 0</code> 时：
                <ul>
                  <li>交换 <code>nums[slow]</code> 和 <code>nums[fast]</code></li>
                  <li><code>slow++</code></li>
                </ul>
              </li>
              <li>遍历结束后，所有非零元素都移到了前面</li>
            </ol>
          </div>

          <div className="explanation-section">
            <h4>复杂度分析</h4>
            <ul>
              <li><strong>时间复杂度：</strong>O(n)，只需遍历一次数组</li>
              <li><strong>空间复杂度：</strong>O(1)，只使用常数额外空间</li>
            </ul>
          </div>

          <div className="explanation-section">
            <h4>为什么这样做是正确的？</h4>
            <p>
              <code>slow</code> 指针始终指向"已处理区域"的末尾（即下一个非零元素应该放置的位置）。
              当 <code>fast</code> 找到非零元素时，将其交换到 <code>slow</code> 位置，
              保证了所有非零元素按原顺序排列在数组前部，零元素自然被"挤"到后面。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanation;
