import React from 'react';
import './AlgorithmExplanation.css';

const AlgorithmExplanation: React.FC = () => {
  return (
    <div className="explanation-section">
      <h3 className="section-title">算法思路</h3>
      <div className="explanation-content">
        <p>
          <strong>双指针法</strong>使用<strong>slow</strong>和<strong>fast</strong>指针：
        </p>
        <ol className="explanation-steps">
          <li><strong>slow</strong>：追踪非零元素应放置的位置</li>
          <li><strong>fast</strong>：遍历数组寻找非零元素</li>
          <li>当找到非零元素时交换，慢指针前进</li>
          <li>结果：非零元素在前，零在后</li>
        </ol>
      </div>
    </div>
  );
};

export default AlgorithmExplanation; 