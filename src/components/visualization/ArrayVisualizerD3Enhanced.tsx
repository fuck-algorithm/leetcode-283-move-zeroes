import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './ArrayVisualizerD3.css';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';
import { 
  createSwapPaths,
  applySwapAnimation,
  applyElementAnimation
} from '../../utils/d3AnimationUtils';
import {
  createElementDataFromStep,
  renderArrayElements,
  addSlowPointer,
  addFastPointer
} from './ArrayElementD3';

interface ArrayVisualizerEnhancedProps {
  step: AlgorithmStepD3;
  prevStep?: AlgorithmStepD3;
}

const ArrayVisualizerD3Enhanced: React.FC<ArrayVisualizerEnhancedProps> = ({ step, prevStep }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step || !step.array || step.array.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    // 清除之前的元素
    svg.selectAll("*").remove();
    
    // 设置svg尺寸和布局参数
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const width = Math.min(window.innerWidth - 40, step.array.length * 60);
    const height = 120;
    
    svg.attr("width", width)
       .attr("height", height);
    
    // 每个元素的宽度
    const elementWidth = Math.min(50, (width - margin.left - margin.right) / step.array.length);
    const elementHeight = elementWidth;
    const elementPadding = 8;
    
    // 数组元素的容器
    const arrayGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // 创建数据对象并渲染数组元素
    const elementData = createElementDataFromStep(step, elementWidth, elementPadding);
    const cells = renderArrayElements(arrayGroup, elementData, elementWidth, elementHeight);
    
    // 处理交换开始阶段动画
    if (step.animationPhase === 'swap-start' && prevStep) {
      // 找到需要交换的两个元素索引
      let swapIndices: number[] = [];
      Object.entries(step.elementStates).forEach(([idx, state]) => {
        if (state.swapping) {
          swapIndices.push(parseInt(idx));
        }
      });
      
      if (swapIndices.length === 2) {
        const [idx1, idx2] = swapIndices;
        createSwapPaths(svg, arrayGroup, idx1, idx2, elementWidth, elementHeight, elementPadding);
      }
    }
    
    // 处理交换结束阶段动画
    if (prevStep && step.animationPhase === 'swap-end') {
      // 找到需要交换的两个元素索引
      let swapIndices: number[] = [];
      Object.entries(prevStep.elementStates).forEach(([idx, state]) => {
        if (state.swapping) {
          swapIndices.push(parseInt(idx));
        }
      });
      
      if (swapIndices.length === 2) {
        const [idx1, idx2] = swapIndices;
        const val1 = prevStep.array[idx1];
        const val2 = prevStep.array[idx2];
        
        // 获取元素在交换后的位置
        const newIdx1 = step.array.findIndex(v => v === val1);
        const newIdx2 = step.array.findIndex(v => v === val2);
        
        applySwapAnimation(cells, val1, val2, idx1, idx2, newIdx1, newIdx2, elementWidth, elementPadding);
      }
    }
    
    // 添加指针
    addSlowPointer(cells, elementWidth);
    addFastPointer(cells, elementWidth, elementHeight);
    
    // 应用其他动画效果
    applyElementAnimation(cells, svg, step.animationPhase, elementWidth);
    
    // 添加脉冲动画效果
    svg.selectAll(".pointer circle")
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", "10;12;10")
      .attr("dur", "1s")
      .attr("repeatCount", "indefinite");
    
  }, [step, prevStep]);

  return (
    <div className="array-container-d3">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ArrayVisualizerD3Enhanced; 