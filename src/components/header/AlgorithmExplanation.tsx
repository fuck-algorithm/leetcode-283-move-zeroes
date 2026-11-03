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
          <h3>把非零数字依次放到前面</h3>

          <div className="explanation-section">
            <h4>先认识两个位置标记</h4>
            <ul>
              <li>
                <code>fast</code>（查找位置）：从左到右逐格检查数字，看看是不是 0。
                代码里的第 0 格就是平常说的第 1 格。
              </li>
              <li>
                <code>slow</code>（放置位置）：指出下一个非零数字应该放在哪一格。
              </li>
              <li>
                两个标记重合，说明中间没有空位；这个数字已经在正确位置，不用挪动。
              </li>
            </ul>
          </div>

          <div className="explanation-section">
            <h4>拿 [0, 1, 0, 3, 12] 举例</h4>
            <ol>
              <li>两个标记都从第 1 格开始（代码里编号是 0）。</li>
              <li><code>fast</code> 看到第 1 格的 0：0 不算进前面的结果，先留在原格；<code>slow</code> 不动。</li>
              <li>
                <code>fast</code> 看到第 2 格的 1：第 1 格是前面 0 留下的空格，
                把 1 放进去；<code>slow</code> 和 <code>fast</code> 都向右走。
              </li>
              <li><code>fast</code> 看到第 3 格的 0：跳过，<code>slow</code> 留在第 2 格。</li>
              <li><code>fast</code> 接着找到 3 和 12：依次填进第 2、3 格的空位。</li>
              <li>检查结束，得到 [1, 3, 12, 0, 0]。</li>
            </ol>
          </div>

          <div className="explanation-section">
            <h4>为什么要按顺序放？</h4>
            <p>
              <code>fast</code> 总是从左往右找数字，所以会按原顺序遇到非零数字。
              每次把它放进最靠左的空位，就不会打乱这些数字的先后次序。
            </p>
          </div>

          <div className="explanation-section">
            <h4>运行成本</h4>
            <ul>
              <li>每个数字只检查一次，数组越长，检查次数也按比例增加。</li>
              <li>直接调整原数组，不需要再复制一份数组。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanation;
