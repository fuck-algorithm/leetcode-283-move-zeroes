/**
 * 箭头渲染器组件
 * 渲染交换操作的动画箭头
 * Requirements: 6.5
 */

import React, { useEffect, useState } from 'react';
import { ARROW_COLORS } from '../../utils/colorScheme';

interface ArrayLayout {
  arrayLength: number;
  elementWidth: number;
  elementHeight: number;
  spacing: number;
  totalWidth: number;
  startX: number;
  startY: number;
}

interface ArrowRendererProps {
  fromIndex: number;
  toIndex: number;
  layout: ArrayLayout;
  isAnimating?: boolean;
  animationPhase?: 'prepare' | 'execute' | 'complete';
  forwardLabel: string;
  reverseLabel: string;
}

const ArrowRenderer: React.FC<ArrowRendererProps> = ({
  fromIndex,
  toIndex,
  layout,
  isAnimating = false,
  animationPhase = 'execute',
  forwardLabel,
  reverseLabel,
}) => {
  const { elementWidth, elementHeight, spacing, startX, startY } = layout;
  const [animationProgress, setAnimationProgress] = useState(0);

  // 计算元素中心位置
  const getElementCenterX = (index: number) => 
    startX + index * (elementWidth + spacing) + elementWidth / 2;

  const fromX = getElementCenterX(fromIndex);
  const toX = getElementCenterX(toIndex);
  const curveHeight = 50; // 增大箭头弧度高度

  // 上方箭头路径（从 from 到 to）
  const midX = (fromX + toX) / 2;
  const topPath = `M ${fromX} ${startY - 12} Q ${midX} ${startY - curveHeight - 30} ${toX} ${startY - 12}`;
  
  // 下方箭头路径（从 to 到 from）
  const bottomPath = `M ${toX} ${startY + elementHeight + 12} Q ${midX} ${startY + elementHeight + curveHeight + 30} ${fromX} ${startY + elementHeight + 12}`;

  // 动画效果
  useEffect(() => {
    if (isAnimating && animationPhase === 'execute') {
      const interval = setInterval(() => {
        setAnimationProgress(prev => (prev + 2) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimating, animationPhase]);

  // 根据动画阶段获取颜色
  const getArrowColor = () => {
    switch (animationPhase) {
      case 'prepare':
        return '#f59e0b';  // 橙色 - 准备
      case 'execute':
        return '#ef4444';  // 红色 - 执行中
      case 'complete':
        return '#059669';  // 绿色 - 完成
      default:
        return ARROW_COLORS.swap;
    }
  };

  const arrowColor = getArrowColor();
  const forwardBadgeWidth = Math.min(240, Math.max(112, forwardLabel.length * 6 + 20));
  const reverseBadgeWidth = Math.min(240, Math.max(112, reverseLabel.length * 6 + 20));
  const badgeX = (width: number) => Math.max(
    startX + 4,
    Math.min(midX - width / 2, startX + layout.totalWidth - width - 4)
  );

  // 动画虚线偏移
  const dashOffset = isAnimating ? animationProgress : 0;

  return (
    <g className="arrow-renderer">
      {/* 定义箭头标记 */}
      <defs>
        <marker
          id="arrowhead-top"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={arrowColor}
          />
        </marker>
        <marker
          id="arrowhead-bottom"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={arrowColor}
          />
        </marker>
        {/* 发光效果 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <path
        d={topPath}
        fill="none"
        stroke={arrowColor}
        strokeWidth={isAnimating ? 3 : 2}
        strokeDasharray={isAnimating ? "8,4" : "5,3"}
        strokeDashoffset={-dashOffset}
        markerEnd="url(#arrowhead-top)"
        filter={isAnimating ? "url(#glow)" : undefined}
        style={{
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
        }}
      />
      <g
        className="arrow-explanation arrow-explanation-forward"
        data-testid="arrow-explanation-forward"
        role="img"
        aria-label={forwardLabel}
      >
        <rect
          x={badgeX(forwardBadgeWidth)}
          y={startY - curveHeight - 42}
          width={forwardBadgeWidth}
          height={24}
          rx={12}
          fill="#fffdf7"
          stroke={arrowColor}
          strokeWidth={1.5}
        />
        <text
          x={badgeX(forwardBadgeWidth) + forwardBadgeWidth / 2}
          y={startY - curveHeight - 26}
          textAnchor="middle"
          fill="#263a32"
          fontSize={12}
          fontWeight={700}
        >{forwardLabel}</text>
      </g>

      {/* 下方箭头 */}
      <path
        d={bottomPath}
        fill="none"
        stroke={arrowColor}
        strokeWidth={isAnimating ? 3 : 2}
        strokeDasharray={isAnimating ? "8,4" : "5,3"}
        strokeDashoffset={dashOffset}
        markerEnd="url(#arrowhead-bottom)"
        filter={isAnimating ? "url(#glow)" : undefined}
        style={{
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
        }}
      />
      <g
        className="arrow-explanation arrow-explanation-reverse"
        data-testid="arrow-explanation-reverse"
        role="img"
        aria-label={reverseLabel}
      >
        <rect
          x={badgeX(reverseBadgeWidth)}
          y={startY + elementHeight + curveHeight + 16}
          width={reverseBadgeWidth}
          height={24}
          rx={12}
          fill="#fffdf7"
          stroke={arrowColor}
          strokeWidth={1.5}
        />
        <text
          x={badgeX(reverseBadgeWidth) + reverseBadgeWidth / 2}
          y={startY + elementHeight + curveHeight + 32}
          textAnchor="middle"
          fill="#263a32"
          fontSize={12}
          fontWeight={700}
        >{reverseLabel}</text>
      </g>

      {/* 阶段状态由箭头描边/动画表达，方向与对象由线上徽标说明。 */}
      <g className="swap-phase-label" aria-hidden="true">
        <rect
          x={midX - 30}
          y={startY + elementHeight + curveHeight + 40}
          width={60}
          height={22}
          rx={11}
          fill={arrowColor}
          opacity={0.9}
        />
        <text
          x={midX}
          y={startY + elementHeight + curveHeight + 55}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={12}
          fontWeight={600}
        >
          {animationPhase === 'prepare' ? '准备' : animationPhase === 'complete' ? '完成' : '交换'}
        </text>
      </g>

      {/* 元素值标签 */}
      <g className="value-labels">
        {/* 左侧元素值 */}
        <circle
          cx={fromX}
          cy={startY - curveHeight - 45}
          r={14}
          fill={arrowColor}
          opacity={0.8}
        />
        <text
          x={fromX}
          y={startY - curveHeight - 40}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={11}
          fontWeight={600}
        >
          [{fromIndex}]
        </text>

        {/* 右侧元素值 */}
        <circle
          cx={toX}
          cy={startY - curveHeight - 45}
          r={14}
          fill={arrowColor}
          opacity={0.8}
        />
        <text
          x={toX}
          y={startY - curveHeight - 40}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={11}
          fontWeight={600}
        >
          [{toIndex}]
        </text>
      </g>
    </g>
  );
};

export default ArrowRenderer;
