import React from 'react';
import { AlgorithmStep, AnnotationConfig } from '../../types';

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

const AnnotationRenderer: React.FC<AnnotationRendererProps> = ({ step, layout }) => {
  const { startX, startY, elementHeight, elementWidth, spacing } = layout;
  const getElementX = (index: number) =>
    startX + index * (elementWidth + spacing) + elementWidth / 2;

  const renderRegion = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'region' || annotation.fromIndex === undefined ||
      annotation.toIndex === undefined) return null;
    const x = startX + annotation.fromIndex * (elementWidth + spacing) - 8;
    const right = startX + annotation.toIndex * (elementWidth + spacing) + elementWidth + 8;
    const y = startY - 60;
    return (
      <g key={`region-${index}`} className="region-annotation">
        <rect
          x={x}
          y={y}
          width={right - x}
          height={elementHeight + 80}
          rx={8}
          fill={annotation.color || '#edf3f0'}
          opacity={0.3}
        />
        {annotation.text && (
          <text
            x={(x + right) / 2}
            y={y - 10}
            textAnchor="middle"
            fill="#60756d"
            fontSize={11}
          >{annotation.text}</text>
        )}
      </g>
    );
  };

  const renderArrow = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'arrow' || annotation.fromIndex === undefined ||
      annotation.toIndex === undefined) return null;
    const fromX = getElementX(annotation.fromIndex);
    const toX = getElementX(annotation.toIndex);
    const y = startY + elementHeight + 48;
    const midX = (fromX + toX) / 2;
    const markerId = `annotation-arrow-${step.id}-${index}`;
    return (
      <g key={`arrow-${index}`} className="arrow-annotation">
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#b37b19" />
          </marker>
        </defs>
        <path
          d={`M${fromX},${y} Q${midX},${y + 16} ${toX},${y}`}
          fill="none"
          stroke="#b37b19"
          strokeWidth={2}
          markerEnd={`url(#${markerId})`}
        />
        {annotation.text && (
          <text
            x={midX}
            y={y + 31}
            textAnchor="middle"
            fill="#76530c"
            fontSize={11}
          >{annotation.text}</text>
        )}
      </g>
    );
  };

  const renderComparison = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'comparison' || annotation.fromIndex === undefined) return null;
    const x = getElementX(annotation.fromIndex);
    const y = startY - 75;
    return (
      <g key={`comparison-${index}`} className="comparison-annotation">
        <rect x={x - 48} y={y - 13} width={96} height={26} rx={13} fill="#fff6df" stroke="#b37b19" />
        <text x={x} y={y + 4} textAnchor="middle" fill="#49350d" fontSize={11}>
          {annotation.text}
        </text>
      </g>
    );
  };

  const renderLabel = (annotation: AnnotationConfig, index: number) => {
    if (annotation.type !== 'label') return null;
    const centerX = startX + layout.totalWidth / 2;
    const y = annotation.position === 'top' ? startY - 85 : startY + elementHeight + 84;
    return (
      <text
        key={`label-${index}`}
        className="label-annotation"
        x={centerX}
        y={y}
        textAnchor="middle"
        fill="#60756d"
        fontSize={11}
      >{annotation.text}</text>
    );
  };

  return (
    <g className="annotation-renderer">
      {step.annotations?.map((annotation, index) => {
        switch (annotation.type) {
          case 'region': return renderRegion(annotation, index);
          case 'arrow': return renderArrow(annotation, index);
          case 'comparison': return renderComparison(annotation, index);
          case 'label': return renderLabel(annotation, index);
          default: return null;
        }
      })}
    </g>
  );
};

export default AnnotationRenderer;
