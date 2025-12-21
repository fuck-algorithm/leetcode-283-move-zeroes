/**
 * 数组渲染器组件
 * 渲染数组元素，支持多种状态显示和动画效果
 * Requirements: 6.3, 6.7
 */

import React from 'react';
import { StepAction } from '../../types';
import { getArrayElementColor, COLORS } from '../../utils/colorScheme';

interface ArrayLayout {
  elementWidth: number;
  elementHeight: number;
  spacing: number;
  startX: number;
  startY: number;
}

interface ArrayRendererProps {
  array: number[];
  layout: ArrayLayout;
  slowPointer: number;
  fastPointer: number;
  action: StepAction;
  highlightIndices?: number[];
}

const ArrayRenderer: React.FC<ArrayRendererProps> = ({
  array,
  layout,
  slowPointer,
  fastPointer,
  action,
  highlightIndices = [],
}) => {
  const { elementWidth, elementHeight, spacing, startX, startY } = layout;

  // 判断元素是否需要特殊高亮
  const getElementState = (index: number, value: number) => {
    const isSlowPointer = index === slowPointer;
    const isFastPointer = index === fastPointer;
    const isHighlighted = highlightIndices.includes(index);
    
    // 交换相关的动作
    const isSwapAction = ['swap', 'swap_prepare', 'swap_execute', 'swap_complete'].includes(action);
    const isSwapping = isSwapAction && (isSlowPointer || isFastPointer) && slowPointer !== fastPointer;
    
    // 比较动作
    const isComparing = ['compare', 'compare_zero', 'compare_nonzero'].includes(action) && isFastPointer;
    
    // 已处理区域（在 slow 指针左侧的非零元素）
    const isProcessed = index < slowPointer && value !== 0;
    
    return {
      isSlowPointer,
      isFastPointer,
      isHighlighted,
      isSwapping,
      isComparing,
      isProcessed,
    };
  };

  // 获取元素的颜色
  const getElementColors = (index: number, value: number) => {
    const state = getElementState(index, value);
    
    // 交换中的元素 - 红色边框
    if (state.isSwapping) {
      return {
        fill: value === 0 ? '#fecaca' : '#fee2e2',
        stroke: '#ef4444',
        text: '#991b1b',
        strokeWidth: 3,
        strokeDasharray: action === 'swap_execute' ? '5,3' : 'none',
      };
    }
    
    // 比较中的元素 - 橙色边框
    if (state.isComparing) {
      return {
        fill: value === 0 ? '#fed7aa' : '#ffedd5',
        stroke: '#f59e0b',
        text: '#92400e',
        strokeWidth: 3,
        strokeDasharray: 'none',
      };
    }
    
    // 高亮的元素
    if (state.isHighlighted && !state.isSwapping && !state.isComparing) {
      return {
        fill: '#fef3c7',
        stroke: '#f59e0b',
        text: '#92400e',
        strokeWidth: 2,
        strokeDasharray: 'none',
      };
    }
    
    // 已处理的元素 - 绿色
    if (state.isProcessed) {
      return {
        fill: '#d1fae5',
        stroke: '#059669',
        text: '#065f46',
        strokeWidth: 2,
        strokeDasharray: 'none',
      };
    }
    
    // 零元素 - 灰色
    if (value === 0) {
      return {
        fill: '#9ca3af',
        stroke: '#6b7280',
        text: '#ffffff',
        strokeWidth: 2,
        strokeDasharray: 'none',
      };
    }
    
    // 普通非零元素 - 蓝色
    return {
      fill: '#3b82f6',
      stroke: '#1d4ed8',
      text: '#ffffff',
      strokeWidth: 2,
      strokeDasharray: 'none',
    };
  };

  return (
    <g className="array-renderer">
      {array.map((value, index) => {
        const x = startX + index * (elementWidth + spacing);
        const y = startY;
        const colors = getElementColors(index, value);
        const state = getElementState(index, value);

        return (
          <g key={index} className="array-element">
            {/* 元素背景 */}
            <rect
              x={x}
              y={y}
              width={elementWidth}
              height={elementHeight}
              rx={6}
              ry={6}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={colors.strokeWidth}
              strokeDasharray={colors.strokeDasharray}
              style={{
                transition: 'all 0.3s ease',
              }}
            />

            {/* 元素值 */}
            <text
              x={x + elementWidth / 2}
              y={y + elementHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors.text}
              fontSize={16}
              fontWeight={600}
              fontFamily="Consolas, Monaco, monospace"
            >
              {value}
            </text>

            {/* 索引标签 */}
            <text
              x={x + elementWidth / 2}
              y={y + elementHeight + 16}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize={11}
              fontFamily="Consolas, Monaco, monospace"
            >
              [{index}]
            </text>

            {/* 状态标记 - 已处理 */}
            {state.isProcessed && (
              <text
                x={x + elementWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fill="#059669"
                fontSize={10}
                fontWeight={500}
              >
                ✓
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default ArrayRenderer;
