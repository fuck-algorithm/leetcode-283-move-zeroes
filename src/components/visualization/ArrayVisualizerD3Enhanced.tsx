import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './ArrayVisualizerD3.css';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';

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
    
    // 创建数据对象
    const elementData = step.array.map((value, index) => {
      return {
        value: value,
        index: index,
        isZero: value === 0,
        slowPointer: index === step.slow,
        fastPointer: index === step.fast,
        state: step.elementStates[index] || {
          highlighted: false,
          swapping: false,
          comparing: false
        },
        x: index * (elementWidth + elementPadding),
        y: 0
      };
    });
    
    // 创建元素组
    const cells = arrayGroup.selectAll(".array-element")
      .data(elementData)
      .enter()
      .append("g")
      .attr("class", d => `array-element ${d.isZero ? 'zero-element' : ''} ${d.state.swapping ? 'swapping' : ''}`)
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .style("opacity", 1);
    
    // 如果是交换状态且有上一步，应用交换动画
    if (prevStep && step.animationPhase === 'swap-end') {
      const prevData = prevStep.array.map((value, index) => {
        return {
          value: value,
          index: index,
          x: index * (elementWidth + elementPadding)
        };
      });
      
      // 创建映射以找到交换的元素
      const valueToIndexMap: Record<number, number> = {};
      step.array.forEach((value, index) => {
        valueToIndexMap[value] = index;
      });
      
      // 应用交换动画
      cells.filter(d => d.state.swapping)
        .transition()
        .duration(500)
        .attr("transform", d => {
          // 找到该元素在上一步的位置
          const prevIdx = prevData.findIndex(pd => pd.value === d.value);
          const startX = prevIdx * (elementWidth + elementPadding);
          return `translate(${startX}, ${d.y})`;
        })
        .transition()
        .duration(500)
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    }
    
    // 为每个元素添加矩形
    cells.append("rect")
      .attr("width", elementWidth)
      .attr("height", elementHeight)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", d => {
        if (d.state.comparing) return "#ffeb3b"; // 黄色表示比较
        if (d.state.swapping) return "#ff5252"; // 红色表示交换
        if (d.state.highlighted) return "#8bc34a"; // 绿色表示高亮
        return d.isZero ? "#777" : "#61dafb"; // 默认颜色
      })
      .attr("stroke", "#282c34")
      .attr("stroke-width", 1);
    
    // 添加元素值文本
    cells.append("text")
      .attr("x", elementWidth / 2)
      .attr("y", elementHeight / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", d => {
        if (d.state.comparing || d.state.swapping || d.state.highlighted) return "#282c34";
        return d.isZero ? "white" : "#282c34";
      })
      .attr("font-weight", "bold")
      .text(d => d.value);
    
    // 添加慢指针标记
    cells.filter(d => d.slowPointer)
      .append("g")
      .attr("class", "pointer slow")
      .call(g => {
        // 指针圆圈
        g.append("circle")
          .attr("cx", elementWidth / 2)
          .attr("cy", -15)
          .attr("r", 10)
          .attr("fill", "#4caf50");
        
        // 指针标签
        g.append("text")
          .attr("x", elementWidth / 2)
          .attr("y", -15)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .text("S");
        
        // 指针箭头
        g.append("path")
          .attr("d", `M${elementWidth/2 - 5},${-5} L${elementWidth/2},0 L${elementWidth/2 + 5},${-5}`)
          .attr("fill", "#4caf50");
      });
    
    // 添加快指针标记
    cells.filter(d => d.fastPointer)
      .append("g")
      .attr("class", "pointer fast")
      .call(g => {
        // 指针圆圈
        g.append("circle")
          .attr("cx", elementWidth / 2)
          .attr("cy", elementHeight + 15)
          .attr("r", 10)
          .attr("fill", "#f44336");
        
        // 指针标签
        g.append("text")
          .attr("x", elementWidth / 2)
          .attr("y", elementHeight + 15)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .text("F");
        
        // 指针箭头
        g.append("path")
          .attr("d", `M${elementWidth/2 - 5},${elementHeight + 5} L${elementWidth/2},${elementHeight} L${elementWidth/2 + 5},${elementHeight + 5}`)
          .attr("fill", "#f44336");
      });
    
    // 动画效果
    if (step.animationPhase === 'highlight') {
      // 高亮动画
      cells.filter(d => d.state.highlighted)
        .select("rect")
        .transition()
        .duration(300)
        .attr("transform", "scale(1.1)")
        .transition()
        .duration(300)
        .attr("transform", "scale(1)");
    } else if (step.animationPhase === 'compare') {
      // 比较动画
      cells.filter(d => d.state.comparing)
        .select("rect")
        .transition()
        .duration(400)
        .attr("fill", "#ffeb3b")
        .transition()
        .duration(400)
        .attr("fill", d => d.isZero ? "#777" : "#61dafb");
    } else if (step.animationPhase === 'swap-start') {
      // 交换开始动画
      cells.filter(d => d.state.swapping)
        .select("rect")
        .transition()
        .duration(300)
        .attr("fill", "#ff5252");
    } else if (step.animationPhase === 'move') {
      // 指针移动动画
      svg.selectAll(".pointer.slow")
        .transition()
        .duration(300)
        .attr("transform", `translate(${elementWidth/2}, 0)`)
        .transition()
        .duration(300)
        .attr("transform", "translate(0, 0)");
    }
    
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