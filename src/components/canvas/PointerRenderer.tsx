/**
 * 指针渲染器组件
 * 渲染 slow 和 fast 指针
 * Requirements: 6.4
 */

import React from 'react';
import { POINTER_COLORS } from '../../utils/colorScheme';

interface ArrayLayout {
  elementWidth: number;
  elementHeight: number;
  spacing: number;
  startX: number;
  startY: number;
}

interface PointerRendererProps {
  slowPointer: number;
  fastPointer: number;
  layout: ArrayLayout;
}

const PointerRenderer: React.FC<PointerRendererProps> = ({
  slowPointer,
  fastPointer,
  layout,
}) => {
  const { elementWidth, elementHeight, spacing, startX, startY } = layout;
  const pointerSize = 24;
  const pointerOffset = 35;

  // 计算指针位置
  const getPointerX = (index: number) => startX + index * (elementWidth + spacing) + elementWidth / 2;
  const pointerY = startY - pointerOffset;

  // 渲染单个指针
  const renderPointer = (
    index: number,
    label: string,
    colors: { fill: string; stroke: string; text: string; label: string },
    offsetX: number = 0
  ) => {
    const x = getPointerX(index) + offsetX;

    return (
      <g className={`pointer pointer-${label.toLowerCase()}`}>
        {/* 指针三角形 */}
        <polygon
          points={`${x},${pointerY + pointerSize} ${x - pointerSize / 2},${pointerY} ${x + pointerSize / 2},${pointerY}`}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2}
        />

        {/* 指针标签 */}
        <text
          x={x}
          y={pointerY - 8}
          textAnchor="middle"
          fill={colors.label}
          fontSize={12}
          fontWeight={600}
          fontFamily="Consolas, Monaco, monospace"
        >
          {label}
        </text>
      </g>
    );
  };

  // 如果两个指针在同一位置，稍微错开显示
  const isSamePosition = slowPointer === fastPointer;
  const slowOffset = isSamePosition ? -15 : 0;
  const fastOffset = isSamePosition ? 15 : 0;

  return (
    <g className="pointer-renderer">
      {renderPointer(slowPointer, 'slow', POINTER_COLORS.slow, slowOffset)}
      {renderPointer(fastPointer, 'fast', POINTER_COLORS.fast, fastOffset)}
    </g>
  );
};

export default PointerRenderer;
