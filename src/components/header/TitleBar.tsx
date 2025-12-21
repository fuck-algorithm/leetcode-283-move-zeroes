/**
 * 标题栏组件
 * 显示题目编号和标题，支持点击跳转到 LeetCode
 * Requirements: 1.1, 1.2, 1.3
 */

import React, { useEffect } from 'react';
import { TitleBarProps } from '../../types';
import './TitleBar.css';

const TitleBar: React.FC<TitleBarProps> = ({
  problemNumber,
  problemTitle,
  leetCodeUrl,
}) => {
  // 设置浏览器标签页标题
  useEffect(() => {
    document.title = `${problemNumber}. ${problemTitle} - 算法可视化`;
  }, [problemNumber, problemTitle]);

  const handleTitleClick = () => {
    window.open(leetCodeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="title-bar">
      <h1 
        className="title-text"
        onClick={handleTitleClick}
        title="点击查看 LeetCode 原题"
      >
        {problemNumber}. {problemTitle}
      </h1>
    </div>
  );
};

export default TitleBar;
