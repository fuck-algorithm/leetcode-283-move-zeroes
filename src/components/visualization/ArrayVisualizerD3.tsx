import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './ArrayVisualizerD3.css';

interface ArrayElement {
  value: number;
  isZero: boolean;
  slowPointer: boolean;
  fastPointer: boolean;
}

interface ArrayVisualizerProps {
  elements: ArrayElement[];
}

const ArrayVisualizerD3: React.FC<ArrayVisualizerProps> = ({ elements }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || elements.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    // 清除之前的元素
    svg.selectAll("*").remove();
    
    // 设置svg尺寸和布局参数
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const width = Math.min(window.innerWidth - 40, elements.length * 60);
    const height = 120;
    
    svg.attr("width", width)
       .attr("height", height);
    
    // 每个元素的宽度
    const elementWidth = Math.min(50, (width - margin.left - margin.right) / elements.length);
    const elementHeight = elementWidth;
    
    // 数组元素的容器
    const arrayGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // 创建和更新元素
    const cells = arrayGroup.selectAll(".array-element")
      .data(elements)
      .enter()
      .append("g")
      .attr("class", d => `array-element ${d.isZero ? 'zero-element' : ''}`)
      .attr("transform", (d, i) => {
        const x = i * (elementWidth + 8);
        return `translate(${x}, 0)`;
      });
    
    // 为每个元素添加矩形
    cells.append("rect")
      .attr("width", elementWidth)
      .attr("height", elementHeight)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", d => d.isZero ? "#777" : "#61dafb")
      .attr("stroke", "#282c34")
      .attr("stroke-width", 1);
    
    // 添加元素值文本
    cells.append("text")
      .attr("x", elementWidth / 2)
      .attr("y", elementHeight / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", d => d.isZero ? "white" : "#282c34")
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
    
    // 添加动画效果
    svg.selectAll(".slow, .fast")
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("values", "1;0.6;1")
      .attr("dur", "1s")
      .attr("repeatCount", "indefinite");
    
  }, [elements]);

  return (
    <div className="array-container-d3">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ArrayVisualizerD3; 