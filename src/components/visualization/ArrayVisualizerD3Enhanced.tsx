import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ArrayVisualizerD3.css';
import { AlgorithmStepD3 } from '../../utils/algorithmStepsD3';
import { createSwapPaths, applySwapAnimation } from '../../utils/d3AnimationUtils';

interface ArrayVisualizerD3EnhancedProps {
  step: AlgorithmStepD3;
  width: number;
  height: number;
}

const ArrayVisualizerD3Enhanced: React.FC<ArrayVisualizerD3EnhancedProps> = ({ step, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 清除之前的SVG元素
    d3.select(svgRef.current).selectAll('*').remove();

    // 设置SVG
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // 创建主要的绘图区域
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算元素尺寸
    const elementWidth = Math.min(50, contentWidth / step.array.length);
    const elementHeight = Math.min(50, contentHeight);
    const elementPadding = 10;
    const totalWidth = step.array.length * (elementWidth + elementPadding) - elementPadding;
    const startX = (contentWidth - totalWidth) / 2;

    // 创建和更新数组元素
    const arrayGroup = g.append('g')
      .attr('class', 'array-group')
      .attr('transform', `translate(${startX},${contentHeight / 2 - elementHeight / 2})`);

    // 渲染数组元素
    const elements = arrayGroup.selectAll('.array-element')
      .data(step.elementData)
      .enter()
      .append('g')
      .attr('class', 'array-element')
      .attr('transform', (d, i) => {
        // 无论什么阶段，都使用数据的索引位置进行定位
        return `translate(${i * (elementWidth + elementPadding)},0)`;
      });

    // 添加矩形背景
    elements.append('rect')
      .attr('width', elementWidth)
      .attr('height', elementHeight)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('class', 'element-bg')
      .style('fill', d => d.isZero ? '#ff9999' : '#99ff99')
      .style('stroke', d => {
        if (d.state.comparing) return '#ff0000';
        if (d.state.swapping) return '#0000ff';
        if (d.state.highlighted) return '#00ff00';
        return '#000000';
      })
      .style('stroke-width', d => 
        d.state.comparing || d.state.swapping || d.state.highlighted ? 3 : 1
      );

    // 添加文本 - 显示元素的值
    elements.append('text')
      .attr('x', elementWidth / 2)
      .attr('y', elementHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.value) // 直接使用元素数据中的值
      .style('font-size', '16px')
      .style('font-weight', 'bold');

    // 添加索引标签
    elements.append('text')
      .attr('x', elementWidth / 2)
      .attr('y', elementHeight + 15)
      .attr('text-anchor', 'middle')
      .text((d, i) => i)
      .style('font-size', '10px')
      .style('fill', '#aaaaaa')
      .style('font-weight', 'normal');

    // 如果是交换阶段，执行交换动画
    if (step.phase === 'swap-start') {
      // 打印当前状态，辅助调试
      console.log("交换动画 - 当前步骤:", {
        slow: step.slow,
        fast: step.fast,
        phase: step.phase,
        message: step.message
      });
      
      // 检查数据绑定状态 - 确保正确设置了swapping状态
      step.elementData.forEach((d, i) => {
        if (d.state.swapping) {
          console.log(`元素${i}(值=${d.value})标记为swapping=true`);
        }
      });
      
      // 根据elementData状态选择要交换的元素，而不是根据slow/fast索引
      // 这样可以确保我们选择的是正确的数据对象，无论它们在DOM中的物理位置如何
      const swappingElements = elements.filter(d => d.state.swapping);
      
      // 获取实际交换的元素
      const elementNodesWithSwap = swappingElements.nodes();
      if (elementNodesWithSwap.length !== 2) {
        console.error(`警告: 标记为交换的元素数量不是2，而是${elementNodesWithSwap.length}`);
      }
      
      // 获取两个交换元素的实际位置和DOM索引
      const getElementTransform = (el: Element) => {
        const transform = d3.select(el).attr('transform');
        const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
        if (match && match.length >= 3) {
          return {x: parseFloat(match[1]), y: parseFloat(match[2])};
        }
        return null;
      };
      
      // 获取所有元素位置信息，用于调试
      const allPositions = elements.nodes().map((node, i) => {
        const pos = getElementTransform(node);
        return {index: i, pos, swapping: step.elementData[i].state.swapping};
      });
      console.log("所有元素位置信息:", allPositions);
      
      const paths = createSwapPaths(
        step.slow * (elementWidth + elementPadding),
        step.fast * (elementWidth + elementPadding),
        elementHeight
      );

      // 添加路径到SVG以供动画使用
      const pathGroup = arrayGroup.append('g')
        .attr('class', 'swap-paths');

      // 为路径添加渐变
      const swapGradientId = "swap-path-gradient";
      const swapGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", swapGradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      swapGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ff416c");

      swapGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#ff4b2b");

      // 添加发光效果
      const glowFilter = svg.append("defs")
        .append("filter")
        .attr("id", "glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      glowFilter.append("feGaussianBlur")
        .attr("stdDeviation", "4")
        .attr("result", "coloredBlur");

      const feComponentTransfer = glowFilter.append("feComponentTransfer")
        .attr("in", "coloredBlur");
      
      feComponentTransfer.append("feFuncR")
        .attr("type", "linear")
        .attr("slope", "2");
      
      feComponentTransfer.append("feFuncG")
        .attr("type", "linear")
        .attr("slope", "2");
      
      feComponentTransfer.append("feFuncB")
        .attr("type", "linear")
        .attr("slope", "2");

      const feMerge = glowFilter.append("feMerge");
      feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
      feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

      // 添加炫酷的路径效果
      pathGroup.append('path')
        .attr('d', paths[0].getAttribute('d'))
        .style('fill', 'none')
        .style('stroke', `url(#${swapGradientId})`)
        .style('stroke-width', 3)
        .style('stroke-dasharray', '5,3')
        .style('opacity', 0.8)
        .style('filter', 'url(#glow)');

      pathGroup.append('path')
        .attr('d', paths[1].getAttribute('d'))
        .style('fill', 'none')
        .style('stroke', `url(#${swapGradientId})`)
        .style('stroke-width', 3)
        .style('stroke-dasharray', '5,3')
        .style('opacity', 0.8)
        .style('filter', 'url(#glow)');

      // 在交换路径上添加小粒子作为动画效果
      const numParticles = 5;
      const particleRadius = 3;
      
      for (let i = 0; i < 2; i++) {
        const pathLength = paths[i].getTotalLength();
        
        for (let j = 0; j < numParticles; j++) {
          // 均匀分布粒子
          const point = paths[i].getPointAtLength((j / numParticles) * pathLength);
          
          pathGroup.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', particleRadius)
            .style('fill', 'white')
            .style('filter', 'url(#glow)')
            .style('opacity', 0.7);
        }
      }

      // 高亮将要交换的元素 - 使用swapping标记而不是索引
      swappingElements
        .selectAll('rect')
        .style('filter', 'url(#glow)');

      // 重要修改：对元素清晰标记并查找正确的交换元素
      // 1. 首先清除所有元素的交换标记
      elements.attr('data-swapping', null);
      
      // 2. 直接在DOM中标记需要交换的元素
      elements.each(function(d, i) {
        if (d.state.swapping) {
          if (i === step.slow) {
            d3.select(this).attr('data-swapping', 'slow');
            console.log(`已标记slow元素，索引=${i}, 值=${d.value}`);
          } else if (i === step.fast) {
            d3.select(this).attr('data-swapping', 'fast');
            console.log(`已标记fast元素，索引=${i}, 值=${d.value}`);
          }
        }
      });
      
      // 3. 并为交换组添加自定义属性，使其更容易识别
      swappingElements.attr('class', d => {
        const baseClass = `array-element ${d.isZero ? 'zero-element' : ''}`;
        return baseClass + ' swapping-element';
      });

      // 确保找到交换元素
      const slowEl = arrayGroup.select('g.array-element[data-swapping="slow"]');
      const fastEl = arrayGroup.select('g.array-element[data-swapping="fast"]');
      
      if (slowEl.empty() || fastEl.empty()) {
        console.error("找不到交换元素，改用索引查找");
        
        // 备用：如果找不到标记的元素，使用索引位置
        const slowNode = elements.nodes()[step.slow];
        const fastNode = elements.nodes()[step.fast];
        
        if (slowNode) d3.select(slowNode).attr('data-swapping', 'slow');
        if (fastNode) d3.select(fastNode).attr('data-swapping', 'fast');
      }

      // 使用正确的DOM索引传递给交换动画函数
      applySwapAnimation(
        arrayGroup,
        step.slow,
        step.fast,
        paths,
        elementWidth,
        elementPadding
      );
    }

    // 添加指针
    const addPointer = (index: number, label: string, colorStart: string, colorEnd: string, isTop: boolean) => {
      if (index >= step.array.length) return;

      const x = startX + index * (elementWidth + elementPadding) + elementWidth / 2;
      // 根据是顶部还是底部指针确定y位置
      const yCircle = isTop 
        ? contentHeight / 2 - elementHeight / 2 - 60 // 增加与元素的距离
        : contentHeight / 2 + elementHeight / 2 + 60; // 增加与元素的距离
      
      // 箭头指向的位置
      const yArrowEnd = isTop
        ? contentHeight / 2 - elementHeight / 2 // 顶部箭头指向元素顶部
        : contentHeight / 2 + elementHeight / 2; // 底部箭头指向元素底部
      
      // 创建指针组
      const pointer = g.append('g')
        .attr('class', `${label.toLowerCase()}-pointer`);
      
      // 创建渐变
      const gradientId = `pointer-gradient-${label}`;
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
        
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorStart);
        
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colorEnd);

      // 定义指针圆形头部
      pointer.append('circle')
        .attr('cx', x)
        .attr('cy', yCircle)
        .attr('r', 15)
        .style('fill', `url(#${gradientId})`)
        .style('stroke', '#ffffff')
        .style('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))');
      
      // 添加标签文字
      pointer.append('text')
        .attr('x', x)
        .attr('y', yCircle)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .text(label)
        .style('fill', '#ffffff')
        .style('font-weight', 'bold')
        .style('font-size', '12px')
        .style('text-shadow', '0px 1px 1px rgba(0,0,0,0.3)');
      
      // 创建箭头身体 - 更明显的杆状部分
      const arrowShaftLength = Math.abs(yCircle - yArrowEnd) - 20; // 箭头身体长度
      
      // 箭头身体 - 粗线条
      pointer.append('rect')
        .attr('x', x - 2.5)  // 居中放置，宽度为5
        .attr('y', isTop ? yCircle + 15 : yArrowEnd + 8)  // 顶部或底部
        .attr('width', 5)  // 粗线宽度
        .attr('height', isTop ? arrowShaftLength - 8 : arrowShaftLength - 8)  // 根据方向设置长度
        .style('fill', `url(#${gradientId})`)
        .style('rx', 2)  // 圆角矩形
        .style('ry', 2)
        .style('filter', 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))');
      
      // 箭头头部 - 更大的三角形
      const arrowHeadY = isTop ? yArrowEnd - 8 : yArrowEnd + 8;
      
      pointer.append('path')
        .attr('d', `M ${x} ${yArrowEnd} 
                   L ${x - 10} ${arrowHeadY} 
                   L ${x + 10} ${arrowHeadY} Z`)
        .style('fill', `url(#${gradientId})`)
        .style('stroke', '#ffffff')
        .style('stroke-width', 1)
        .style('filter', 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))');
    };

    // 添加慢指针和快指针，使用渐变色
    // 慢指针在顶部，快指针在底部，当重叠时两者都可见
    addPointer(step.slow, 'S', '#f44336', '#d32f2f', true); // 设置为顶部指针
    addPointer(step.fast, 'F', '#2196f3', '#1565c0', false); // 设置为底部指针

  }, [step, width, height]);

  return (
    <div className="array-container-d3">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: 'none' }}
      ></svg>
    </div>
  );
};

export default ArrayVisualizerD3Enhanced; 