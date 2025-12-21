/**
 * 标注渲染器组件
 * 渲染步骤相关的文字标注、区域标记和操作说明
 * Requirements: 6.6, 6.9
 */

import React from 'react';
import { AlgorithmStep, AnnotationConfig } from '../../types';
import { COLORS } from '../../utils/colorScheme';
import { getActionColor } from '../../utils/stepGenerator';

interface ArrayLayout {
  elementWidth: number;
  elementHeight: number;
  spacing: number;
  startX: number;
  startY: number;
  totalWidth: number;
}

interface AnnotationRendererProps {
  step: AlgorithmStep;
  layout: ArrayLayout;
}

const AnnotationRenderer: React.FC<AnnotationRendererProps> = ({
  step,
  layout,
}) => {
  const { startX, startY, totalWidth, elementHeight, elementWidth, spacing } = layout;
  const centerX = startX + totalWidth / 2;
  const annotationY = startY + elementHeight + 70;

  // 获取元素的X坐标
  const getElementX = (index: number) => startX + index * (elementWidth + spacing) + elementWidth / 2;

  // 根据操作类型获取主标注颜色
  const actionColor = getActionColor(step.action);

  // 渲染区域标注
  const renderRegionAnnotation = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'region' || annotation.fromIndex === undefined || annotation.toIndex === undefined) {
      return null;
    }

    const fromX = startX + annotation.fromIndex * (elementWidth + spacing) - 5;
    const toX = startX + annotation.toIndex * (elementWidth + spacing) + elementWidth + 5;
    const width = toX - fromX;
    const regionY = startY - 45;

    return (
      <g key={`region-${index}`} className="region-annotation">
        {/* 区域背景 */}
        <rect
          x={fromX}
          y={regionY}
          width={width}
          height={elementHeight + 60}
          rx={8}
          fill={annotation.color || '#f3f4f6'}
          opacity={0.3}
        />
        {/* 区域标签 */}
        {annotation.text && (
          <text
            x={fromX + width / 2}
            y={regionY - 8}
            textAnchor="middle"
            fill={annotation.color || '#6b7280'}
            fontSize={11}
            fontWeight={500}
          >
            {annotation.text}
          </text>
        )}
      </g>
    );
  };

  // 渲染箭头标注
  const renderArrowAnnotation = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'arrow' || annotation.fromIndex === undefined || annotation.toIndex === undefined) {
      return null;
    }

    const fromX = getElementX(annotation.fromIndex);
    const toX = getElementX(annotation.toIndex);
    const arrowY = startY + elementHeight + 45;

    // 创建弯曲路径
    const midX = (fromX + toX) / 2;
    const curveHeight = 15;
    const path = `M ${fromX} ${arrowY} Q ${midX} ${arrowY + curveHeight} ${toX} ${arrowY}`;

    return (
      <g key={`arrow-${index}`} className="arrow-annotation">
        <defs>
          <marker
            id={`arrowhead-${index}`}
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill={annotation.color || '#f59e0b'}
            />
          </marker>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={annotation.color || '#f59e0b'}
          strokeWidth={2}
          markerEnd={`url(#arrowhead-${index})`}
        />
        {annotation.text && (
          <text
            x={midX}
            y={arrowY + curveHeight + 15}
            textAnchor="middle"
            fill={annotation.color || '#f59e0b'}
            fontSize={11}
            fontWeight={500}
          >
            {annotation.text}
          </text>
        )}
      </g>
    );
  };

  // 渲染比较标注
  const renderComparisonAnnotation = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'comparison' || annotation.fromIndex === undefined) {
      return null;
    }

    const x = getElementX(annotation.fromIndex);
    const y = startY - 55;

    return (
      <g key={`comparison-${index}`} className="comparison-annotation">
        {/* 比较气泡 */}
        <rect
          x={x - 50}
          y={y - 12}
          width={100}
          height={24}
          rx={12}
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth={1}
        />
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fill="#92400e"
          fontSize={12}
          fontWeight={500}
        >
          {annotation.text}
        </text>
        {/* 指向箭头 */}
        <polygon
          points={`${x - 6},${y + 12} ${x + 6},${y + 12} ${x},${y + 20}`}
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth={1}
        />
      </g>
    );
  };

  // 渲染标签标注
  const renderLabelAnnotation = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'label') {
      return null;
    }

    const y = annotation.position === 'top' ? startY - 65 : annotationY + 45;

    return (
      <g key={`label-${index}`} className="label-annotation">
        <text
          x={centerX}
          y={y}
          textAnchor="middle"
          fill={annotation.color || '#6b7280'}
          fontSize={12}
          fontWeight={500}
        >
          {annotation.text}
        </text>
      </g>
    );
  };

  // 渲染所有标注
  const renderAnnotations = () => {
    if (!step.annotations) return null;

    return step.annotations.map((annotation, index) => {
      switch (annotation.type) {
        case 'region':
          return renderRegionAnnotation(annotation, index);
        case 'arrow':
          return renderArrowAnnotation(annotation, index);
        case 'comparison':
          return renderComparisonAnnotation(annotation, index);
        case 'label':
          return renderLabelAnnotation(annotation, index);
        default:
          return null;
      }
    });
  };

  return (
    <g className="annotation-renderer">
      {/* 渲染自定义标注 */}
      {renderAnnotations()}

      {/* 主标注文本 */}
      <text
        x={centerX}
        y={annotationY}
        textAnchor="middle"
        fill={actionColor}
        fontSize={14}
        fontWeight={600}
      >
        {step.description}
      </text>

      {/* 详细描述 */}
      {step.detailDescription && (
        <text
          x={centerX}
          y={annotationY + 20}
          textAnchor="middle"
          fill={COLORS.textLight}
          fontSize={12}
        >
          {step.detailDescription}
        </text>
      )}

      {/* 数组状态显示 */}
      <text
        x={centerX}
        y={annotationY + 42}
        textAnchor="middle"
        fill={COLORS.textLight}
        fontSize={12}
        fontFamily="Consolas, Monaco, monospace"
      >
        nums = [{step.array.join(', ')}]
      </text>

      {/* 完成状态特殊标注 */}
      {step.action === 'complete' && (
        <g>
          <rect
            x={centerX - 80}
            y={annotationY - 55}
            width={160}
            height={32}
            rx={16}
            fill={COLORS.secondary}
          />
          <text
            x={centerX}
            y={annotationY - 34}
            textAnchor="middle"
            fill={COLORS.textInverse}
            fontSize={14}
            fontWeight={600}
          >
            ✓ 算法执行完成
          </text>
        </g>
      )}

      {/* 交换动画提示 */}
      {step.action === 'swap_execute' && step.slowPointer !== step.fastPointer && (
        <g className="swap-indicator">
          <text
            x={centerX}
            y={startY - 75}
            textAnchor="middle"
            fill="#ef4444"
            fontSize={16}
            fontWeight={700}
          >
            ↔ 交换中 ↔
          </text>
        </g>
      )}
    </g>
  );
};

export default AnnotationRenderer;
