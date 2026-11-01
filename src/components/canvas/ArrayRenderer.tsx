import React from 'react';
import { StepAction } from '../../types';

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

const SWAP_ACTIONS: StepAction[] = ['swap', 'swap_prepare', 'swap_execute', 'swap_complete'];

const ArrayRenderer: React.FC<ArrayRendererProps> = ({
  array,
  layout,
  slowPointer,
  fastPointer,
  action,
  highlightIndices = [],
}) => {
  const { elementWidth, elementHeight, spacing, startX, startY } = layout;

  return (
    <g className="array-renderer">
      {array.map((value, index) => {
        const isSlowPointer = index === slowPointer;
        const isFastPointer = index === fastPointer;
        const isHighlighted = highlightIndices.includes(index);
        const isSwapping = SWAP_ACTIONS.includes(action) &&
          (isSlowPointer || isFastPointer) && slowPointer !== fastPointer;
        const isComparing = ['compare', 'compare_zero', 'compare_nonzero'].includes(action) &&
          isFastPointer;
        const isProcessed = index < slowPointer && value !== 0;
        const isCurrent = isHighlighted && !isSwapping && !isComparing;
        const x = startX + index * (elementWidth + spacing);
        const stateLabel = isComparing ? '正在比较' : isProcessed ? '已处理' :
          value === 0 ? '零值' : isCurrent ? '当前元素' : '未处理';

        let colors = {
          fill: value === 0 ? '#dce3e0' : '#edf3f0',
          stroke: value === 0 ? '#87978f' : '#789187',
          text: '#19332a',
          strokeWidth: 2,
          strokeDasharray: 'none',
        };
        if (isProcessed) {
          colors = { fill: '#a9d6c3', stroke: '#4f8d77', text: '#19332a', strokeWidth: 2, strokeDasharray: 'none' };
        } else if (isCurrent) {
          colors = { fill: '#d3e9df', stroke: '#247d61', text: '#19332a', strokeWidth: 2, strokeDasharray: 'none' };
        } else if (isComparing) {
          colors = { fill: '#f7e5af', stroke: '#b37b19', text: '#49350d', strokeWidth: 3, strokeDasharray: 'none' };
        } else if (isSwapping) {
          colors = {
            fill: value === 0 ? '#f7e4d9' : '#fbe9df',
            stroke: '#b95730',
            text: '#743a24',
            strokeWidth: 3,
            strokeDasharray: action === 'swap_execute' ? '5,3' : 'none',
          };
        }

        const status = isComparing ? 'compare' : isProcessed ? 'visited' :
          isCurrent ? 'current' : value === 0 ? 'idle' : 'normal';

        return (
          <g
            key={`array-slot-${index}`}
            className={`array-element array-node--${status}`}
            data-node-id={`array-slot-${index}`}
            data-status={status}
            transform={`translate(${x},${startY})`}
          >
            <rect
              width={elementWidth}
              height={elementHeight}
              rx={7}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={colors.strokeWidth}
              strokeDasharray={colors.strokeDasharray}
              data-state-label={stateLabel}
            />
            <text
              x={elementWidth / 2}
              y={elementHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors.text}
              fontSize={Math.min(16, elementWidth * 0.32)}
              fontWeight={700}
              fontFamily="Consolas, Monaco, monospace"
            >
              {value}
            </text>
            <text
              x={elementWidth / 2}
              y={elementHeight + 16}
              textAnchor="middle"
              fill="#75877f"
              fontSize={10}
              fontFamily="Consolas, Monaco, monospace"
            >
              [{index}]
            </text>
            {isProcessed && (
              <text
                x={elementWidth / 2}
                y={-7}
                textAnchor="middle"
                fill="#17684d"
                fontSize={10}
                fontWeight={700}
              >✓</text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default ArrayRenderer;
