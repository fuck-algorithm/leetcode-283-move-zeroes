/**
 * D3 画布主组件
 * 使用 D3.js 渲染算法可视化，支持缩放和拖拽
 * Requirements: 6.1, 6.2, 6.8
 */

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { D3CanvasProps } from '../../types';
import ArrayRenderer from './ArrayRenderer';
import PointerRenderer from './PointerRenderer';
import ArrowRenderer from './ArrowRenderer';
import AnnotationRenderer from './AnnotationRenderer';
import './D3Canvas.css';

const D3Canvas: React.FC<D3CanvasProps> = ({
  step,
  width,
  height,
  onZoom,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  // 计算元素布局
  const layout = React.useMemo(() => {
    if (!step) return null;

    const arrayLength = step.array.length;
    // 增大元素尺寸和间距，让布局更分散
    const elementWidth = Math.min(80, (width - 200) / arrayLength);
    const elementHeight = 60;
    const spacing = 25; // 增大元素间距
    const totalWidth = arrayLength * (elementWidth + spacing) - spacing;
    const startX = (width - totalWidth) / 2;
    const startY = height / 2 - elementHeight / 2 + 20; // 稍微下移，给指针留更多空间

    return {
      elementWidth,
      elementHeight,
      spacing,
      startX,
      startY,
      totalWidth,
    };
  }, [step, width, height]);

  // 初始化 D3 缩放行为
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        setTransform(event.transform);
        if (onZoom) {
          onZoom(event.transform);
        }
      });

    svg.call(zoom);

    // 保存 g 元素引用
    gRef.current = svg.select<SVGGElement>('.canvas-content').node();

    return () => {
      svg.on('.zoom', null);
    };
  }, [onZoom]);

  // 自动缩放以适应内容
  useEffect(() => {
    if (!svgRef.current || !layout || !step) return;

    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();

    // 计算合适的缩放比例
    const scaleX = (width - 40) / layout.totalWidth;
    const scaleY = (height - 120) / layout.elementHeight;
    const scale = Math.min(scaleX, scaleY, 1.5);

    // 重置到居中位置
    const newTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-width / 2, -height / 2);

    svg.transition()
      .duration(300)
      .call(zoom.transform as any, newTransform);
  }, [step?.array.length, width, height, layout]);

  if (!step || !layout) {
    return (
      <div className="d3-canvas-container">
        <svg ref={svgRef} width={width} height={height} className="d3-canvas">
          <g className="canvas-content">
            <text x={width / 2} y={height / 2} textAnchor="middle" fill="#9ca3af">
              请输入数据开始演示
            </text>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="d3-canvas-container">
      <svg ref={svgRef} width={width} height={height} className="d3-canvas">
        <g className="canvas-content" transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {/* 数组元素 */}
          <ArrayRenderer
            array={step.array}
            layout={layout}
            slowPointer={step.slowPointer}
            fastPointer={step.fastPointer}
            action={step.action}
            highlightIndices={step.highlightIndices}
          />

          {/* 指针 */}
          <PointerRenderer
            slowPointer={step.slowPointer}
            fastPointer={step.fastPointer}
            layout={layout}
          />

          {/* 交换箭头 */}
          {['swap', 'swap_prepare', 'swap_execute', 'swap_complete'].includes(step.action) && 
           step.slowPointer !== step.fastPointer && (
            <ArrowRenderer
              fromIndex={step.slowPointer}
              toIndex={step.fastPointer}
              layout={layout}
              isAnimating={step.action === 'swap_execute'}
              animationPhase={
                step.action === 'swap_prepare' ? 'prepare' :
                step.action === 'swap_complete' ? 'complete' : 'execute'
              }
            />
          )}

          {/* 标注 */}
          <AnnotationRenderer
            step={step}
            layout={layout}
          />
        </g>
      </svg>

      {/* 缩放提示 */}
      <div className="zoom-hint">
        滚轮缩放 · 拖拽移动
      </div>
    </div>
  );
};

export default D3Canvas;
