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
    const elementData = step.elementData[index];
    return {
      value: value,
      index: index,
      isZero: value === 0,
      slowPointer: index === step.slow,
      fastPointer: index === step.fast,
      state: elementData ? elementData.state : {
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
  
  // 添加下标标识
  cells.append("text")
    .attr("class", "index-label")
    .attr("x", elementWidth / 2)
    .attr("y", elementHeight + 20)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#aaa")
    .attr("font-size", "12px")
    .text(d => d.index);
  
  // 添加下标背景，提高可见性
  cells.append("rect")
    .attr("class", "index-background")
    .attr("x", elementWidth / 2 - 10)
    .attr("y", elementHeight + 14)
    .attr("width", 20)
    .attr("height", 16)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", "#282c34")
    .attr("opacity", 0.7)
    .lower(); // 将背景放到标签下面
  
  return cells;
};

/**
 * 添加慢指针
 */
export const addSlowPointer = (
  arrayGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  elementWidth: number,
  elementHeight: number
) => {
  const pointerGroup = arrayGroup.append("g")
    .attr("class", "pointer slow")
    .attr("transform", `translate(${x}, 0)`);

  // 添加指针标签背景
  pointerGroup.append("rect")
    .attr("x", -40)
    .attr("y", -50)
    .attr("width", 80)
    .attr("height", 24)
    .attr("rx", 12)
    .attr("ry", 12)
    .attr("fill", "#4CAF50")
    .attr("opacity", 0.9);

  // 添加指针标签文本
  pointerGroup.append("text")
    .attr("x", 0)
    .attr("y", -32)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Slow Pointer");

  // 添加指针箭头
  pointerGroup.append("path")
    .attr("d", `M0,-26 L0,-10 L-5,-15 M0,-10 L5,-15`)
    .attr("stroke", "#4CAF50")
    .attr("stroke-width", 2)
    .attr("fill", "none");
};

/**
 * 添加快指针
 */
export const addFastPointer = (
  arrayGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  elementWidth: number,
  elementHeight: number
) => {
  const pointerGroup = arrayGroup.append("g")
    .attr("class", "pointer fast")
    .attr("transform", `translate(${x}, 0)`);

  // 添加指针标签背景
  pointerGroup.append("rect")
    .attr("x", -40)
    .attr("y", elementHeight + 26)
    .attr("width", 80)
    .attr("height", 24)
    .attr("rx", 12)
    .attr("ry", 12)
    .attr("fill", "#FF5252")
    .attr("opacity", 0.9);

  // 添加指针标签文本
  pointerGroup.append("text")
    .attr("x", 0)
    .attr("y", elementHeight + 44)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Fast Pointer");

  // 添加指针箭头
  pointerGroup.append("path")
    .attr("d", `M0,${elementHeight + 26} L0,${elementHeight + 10} L-5,${elementHeight + 15} M0,${elementHeight + 10} L5,${elementHeight + 15}`)
    .attr("stroke", "#FF5252")
    .attr("stroke-width", 2)
    .attr("fill", "none");
}; 