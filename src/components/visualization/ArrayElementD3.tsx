import React from 'react';
import * as d3 from 'd3';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';

// 元素数据类型
export interface ElementData {
  value: number;
  index: number;
  isZero: boolean;
  slowPointer: boolean;
  fastPointer: boolean;
  state: {
    highlighted: boolean;
    swapping: boolean;
    comparing: boolean;
  };
  x: number;
  y: number;
}

/**
 * 创建数据对象
 */
export const createElementDataFromStep = (
  step: AlgorithmStepD3,
  elementWidth: number,
  elementPadding: number
): ElementData[] => {
  return step.array.map((value, index) => {
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
};

/**
 * 渲染数组元素
 */
export const renderArrayElements = (
  arrayGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: ElementData[],
  elementWidth: number,
  elementHeight: number
) => {
  // 创建元素组
  const cells = arrayGroup.selectAll(".array-element")
    .data(data)
    .enter()
    .append("g")
    .attr("class", d => `array-element ${d.isZero ? 'zero-element' : ''} ${d.state.swapping ? 'swapping' : ''}`)
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .style("opacity", 1);
  
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
  
  return cells;
};

/**
 * 添加慢指针标记
 */
export const addSlowPointer = (
  cells: d3.Selection<SVGGElement, ElementData, SVGGElement, unknown>,
  elementWidth: number
) => {
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
};

/**
 * 添加快指针标记
 */
export const addFastPointer = (
  cells: d3.Selection<SVGGElement, ElementData, SVGGElement, unknown>,
  elementWidth: number,
  elementHeight: number
) => {
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
}; 