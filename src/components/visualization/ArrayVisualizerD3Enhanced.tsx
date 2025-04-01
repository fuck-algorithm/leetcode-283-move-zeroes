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
    
    // 处理交换动画
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
        
        // 计算元素的位置
        const x1 = idx1 * (elementWidth + elementPadding);
        const x2 = idx2 * (elementWidth + elementPadding);
        
        // 创建交换路径
        const pathGroup = arrayGroup.append("g")
          .attr("class", "swap-paths");
        
        // 绘制交换曲线
        const curve1 = d3.path();
        curve1.moveTo(x1 + elementWidth/2, elementHeight/2);
        curve1.bezierCurveTo(
          x1 + elementWidth/2, elementHeight + 20, 
          x2 + elementWidth/2, elementHeight + 20, 
          x2 + elementWidth/2, elementHeight/2
        );
        
        const curve2 = d3.path();
        curve2.moveTo(x2 + elementWidth/2, elementHeight/2);
        curve2.bezierCurveTo(
          x2 + elementWidth/2, -20, 
          x1 + elementWidth/2, -20, 
          x1 + elementWidth/2, elementHeight/2
        );
        
        // 添加路径
        pathGroup.append("path")
          .attr("d", curve1.toString())
          .attr("fill", "none")
          .attr("stroke", "#ff5252")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,3")
          .attr("opacity", 0)
          .transition()
          .duration(300)
          .attr("opacity", 0.7);
        
        pathGroup.append("path")
          .attr("d", curve2.toString())
          .attr("fill", "none")
          .attr("stroke", "#ff5252")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,3")
          .attr("opacity", 0)
          .transition()
          .duration(300)
          .attr("opacity", 0.7);
        
        // 箭头标记
        svg.append("defs").selectAll("marker")
          .data(["end"])
          .enter().append("marker")
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 5)
          .attr("refY", 0)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("fill", "#ff5252");
      }
    }
    
    // 如果是交换状态且有上一步，应用交换动画
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
        
        // 计算元素的位置
        const x1 = idx1 * (elementWidth + elementPadding);
        const x2 = idx2 * (elementWidth + elementPadding);
        const newX1 = newIdx1 * (elementWidth + elementPadding);
        const newX2 = newIdx2 * (elementWidth + elementPadding);
        
        // 应用交换动画到相应元素
        cells.filter(d => d.value === val1)
          .attr("transform", `translate(${x1}, 0)`)
          .transition()
          .duration(600)
          .attrTween("transform", function() {
            return function(t) {
              // 计算沿曲线的位置
              const y = Math.sin(Math.PI * t) * 30; // 弧形路径
              const x = x1 + (newX1 - x1) * t;
              return `translate(${x}, ${-y})`;
            };
          })
          .transition()
          .duration(100)
          .attr("transform", `translate(${newX1}, 0)`);
        
        cells.filter(d => d.value === val2)
          .attr("transform", `translate(${x2}, 0)`)
          .transition()
          .duration(600)
          .attrTween("transform", function() {
            return function(t) {
              // 计算沿曲线的位置
              const y = Math.sin(Math.PI * t) * 30; // 弧形路径
              const x = x2 + (newX2 - x2) * t;
              return `translate(${x}, ${y})`;
            };
          })
          .transition()
          .duration(100)
          .attr("transform", `translate(${newX2}, 0)`);
      }
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
        .attr("fill", "#ff5252")
        .attr("transform", "scale(1.1)");
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