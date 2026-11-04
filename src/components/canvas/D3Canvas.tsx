import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AlgorithmStep, D3CanvasProps } from '../../types';
import ArrayRenderer from './ArrayRenderer';
import PointerRenderer from './PointerRenderer';
import ArrowRenderer from './ArrowRenderer';
import AnnotationRenderer from './AnnotationRenderer';
import './D3Canvas.css';

const ACTION_LABELS: Record<AlgorithmStep['operation'], string> = {
  init: '准备开始',
  read: '查看数字',
  compare: '判断是不是 0',
  swap: '把数字放到空格',
  move: '寻找下一个空格',
  done: '整理完成',
};

const D3Canvas: React.FC<D3CanvasProps> = ({ step, width, height, onZoom }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const lastArrayLengthRef = useRef(0);
  const lastCanvasSizeRef = useRef({ width: 0, height: 0 });
  const arrayLength = step?.array.length ?? 0;

  const layout = useMemo(() => {
    if (!arrayLength) return null;
    const spacing = arrayLength > 12 ? 10 : 18;
    const elementWidth = Math.min(
      76,
      Math.max(22, (width - 64 - spacing * (arrayLength - 1)) / arrayLength)
    );
    const elementHeight = Math.min(60, Math.max(36, elementWidth * 0.82));
    const totalWidth = arrayLength * elementWidth + Math.max(0, arrayLength - 1) * spacing;
    return {
      arrayLength,
      elementWidth,
      elementHeight,
      spacing,
      startX: (width - totalWidth) / 2,
      startY: height / 2 - elementHeight / 2 + 12,
      totalWidth,
    };
  }, [arrayLength, width, height]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        setTransform(event.transform);
        onZoom?.(event.transform);
      });
    svg.call(zoom);
    return () => {
      svg.on('.zoom', null);
      svg.interrupt();
    };
  }, [onZoom]);

  // Fit only when the viewport or input length changes; normal step changes preserve the camera.
  useEffect(() => {
    if (!svgRef.current || !layout || !step) return;
    const lengthChanged = lastArrayLengthRef.current !== arrayLength;
    const sizeChanged = lastCanvasSizeRef.current.width !== width ||
      lastCanvasSizeRef.current.height !== height;
    if (lastCanvasSizeRef.current.width && !lengthChanged && !sizeChanged) return;

    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scaleX = (width - 40) / layout.totalWidth;
    const scaleY = (height - 120) / layout.elementHeight;
    const scale = Math.max(0.5, Math.min(scaleX, scaleY, 1.5));
    const fitted = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-width / 2, -height / 2);

    svg.interrupt();
    svg.transition()
      .duration(reducedMotion ? 0 : 260)
      .call(zoom.transform as any, fitted);
    lastArrayLengthRef.current = arrayLength;
    lastCanvasSizeRef.current = { width, height };
  }, [arrayLength, width, height, layout, step]);

  if (!step || !layout) {
    return (
      <div className="d3-canvas-container">
        <svg ref={svgRef} width={width} height={height} className="d3-canvas">
          <g className="canvas-content">
            <text x={width / 2} y={height / 2} textAnchor="middle" fill="#75877f">
              请输入数据开始演示
            </text>
          </g>
        </svg>
      </div>
    );
  }

  const processedCount = step.array
    .slice(0, Math.max(0, step.slowPointer))
    .filter(value => value !== 0).length;

  return (
    <div className="d3-canvas-container">
      <div className="canvas-teaching-header" aria-live="polite">
        <div className="canvas-step-meta">
          <span className="canvas-step-count">步骤 {step.id + 1}</span>
          <span
            className={`operation-badge operation-${step.operation}`}
            data-operation={step.operation}
          >{ACTION_LABELS[step.operation]}</span>
        </div>
        <p className="step-narration">{step.narration}</p>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="d3-canvas"
        role="img"
        aria-label={`数组算法演示：${step.narration}`}
      >
        <g
          className="canvas-content"
          transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
        >
          <ArrayRenderer
            array={step.array}
            layout={layout}
            slowPointer={step.slowPointer}
            fastPointer={step.fastPointer}
            action={step.action}
            highlightIndices={step.highlightIndices}
          />
          <PointerRenderer
            slowPointer={step.slowPointer}
            fastPointer={step.fastPointer}
            layout={layout}
          />
          {['swap', 'swap_prepare', 'swap_execute', 'swap_complete'].includes(step.action) &&
            step.slowPointer !== step.fastPointer && (
              <ArrowRenderer
                fromIndex={step.slowPointer}
                toIndex={step.fastPointer}
                layout={layout}
                isAnimating={step.action === 'swap_execute'}
                animationPhase={step.action === 'swap_prepare' ? 'prepare' :
                  step.action === 'swap_complete' ? 'complete' : 'execute'}
                forwardLabel={`fast 的 ${step.array[step.fastPointer]} → slow 空格`}
                reverseLabel={`slow 的 0 → fast 原格`}
              />
            )}
          <AnnotationRenderer step={step} layout={layout} />
        </g>
      </svg>
      <div className="canvas-teaching-footer">
        <div className="canvas-legend" aria-label="画布图例">
          <span><i className="legend-dot legend-slow" />slow 下一个放置位置</span>
          <span><i className="legend-dot legend-fast" />fast 当前检查位置</span>
          <span><i className="legend-swatch legend-compare" />当前数字</span>
          <span><i className="legend-swatch legend-processed" />已放好</span>
          <span><i className="legend-swatch legend-zero" />0</span>
        </div>
        <div className="canvas-metrics" aria-label="算法指标">
          <span>查找格 fast <b>{step.fastPointer < 0 ? '准备中' : step.fastPointer + 1}</b></span>
          <span>放置格 slow <b>{step.slowPointer + 1}</b></span>
          <span>数字换位 <b>{step.variables.swapCount || 0}</b></span>
          <span>已放好 <b>{processedCount}</b></span>
        </div>
      </div>
      <div className="zoom-hint">滚轮缩放 · 拖拽移动</div>
    </div>
  );
};

export default D3Canvas;
