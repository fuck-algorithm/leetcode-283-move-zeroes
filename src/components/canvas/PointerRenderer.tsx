import React from 'react';

interface ArrayLayout {
  arrayLength: number;
  elementWidth: number;
  spacing: number;
  startX: number;
  startY: number;
}

interface PointerRendererProps {
  slowPointer: number;
  fastPointer: number;
  layout: ArrayLayout;
}

const POINTER_STYLE = {
  slow: { fill: '#247d61', stroke: '#145c45', label: '#145c45' },
  fast: { fill: '#b37b19', stroke: '#80570f', label: '#80570f' },
};

const PointerRenderer: React.FC<PointerRendererProps> = ({
  slowPointer,
  fastPointer,
  layout,
}) => {
  const { arrayLength, elementWidth, spacing, startX, startY } = layout;
  const pointerSize = 24;
  const pointerY = startY - 36;
  const getPointerX = (index: number) =>
    startX + index * (elementWidth + spacing) + elementWidth / 2;

  const renderPointer = (index: number, label: 'slow' | 'fast', offsetX = 0) => {
    const x = getPointerX(index) + offsetX;
    const style = POINTER_STYLE[label];
    return (
      <g key={`pointer-${label}`} className={`pointer pointer-${label}`}>
        <polygon
          points={`${x},${pointerY + pointerSize} ${x - pointerSize / 2},${pointerY} ${x + pointerSize / 2},${pointerY}`}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={2}
          data-pointer={label}
        />
        <text
          x={x}
          y={pointerY - 8}
          textAnchor="middle"
          fill={style.label}
          fontSize={label === 'slow' ? 9 : 10}
          fontWeight={700}
          fontFamily="Consolas, Monaco, monospace"
        >{label === 'slow' ? 'slow 放置' : 'fast 检查'}</text>
      </g>
    );
  };

  const samePosition = slowPointer === fastPointer;
  return (
    <g className="pointer-renderer">
      {slowPointer >= 0 && slowPointer < arrayLength &&
        renderPointer(slowPointer, 'slow', samePosition ? -24 : 0)}
      {fastPointer >= 0 && fastPointer < arrayLength &&
        renderPointer(fastPointer, 'fast', samePosition ? 24 : 0)}
    </g>
  );
};

export default PointerRenderer;
