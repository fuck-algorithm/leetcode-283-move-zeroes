import * as d3 from 'd3';
import { AlgorithmStepD3 } from './algorithmStepsD3';

/**
 * 创建交换曲线路径
 */
export const createSwapPaths = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  arrayGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  idx1: number,
  idx2: number,
  elementWidth: number,
  elementHeight: number,
  elementPadding: number
) => {
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
};

/**
 * 应用元素交换动画
 */
export const applySwapAnimation = (
  cells: d3.Selection<SVGGElement, any, SVGGElement, unknown>,
  val1: number,
  val2: number,
  idx1: number,
  idx2: number,
  newIdx1: number,
  newIdx2: number,
  elementWidth: number,
  elementPadding: number,
  arrayGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  elementHeight: number = elementWidth // 添加参数，默认等于elementWidth
) => {
  // 根据索引获取元素
  const element1 = cells.filter(d => d.index === idx1);
  const element2 = cells.filter(d => d.index === idx2);
  
  const x1 = idx1 * (elementWidth + elementPadding);
  const x2 = idx2 * (elementWidth + elementPadding);
  
  // 创建动画辅助元素，用于显示交换过程中的移动路径
  const animationGroup = arrayGroup.append("g")
    .attr("class", "animation-group");
  
  // 添加发光滤镜
  const filterId = "glow-effect-" + Date.now(); // 创建唯一ID避免冲突
  const defs = arrayGroup.append("defs");
  defs.append("filter")
    .attr("id", filterId)
    .attr("x", "-30%")
    .attr("y", "-30%")
    .attr("width", "160%")
    .attr("height", "160%")
    .html(`
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 18 -7
      " result="glow" />
      <feBlend in="SourceGraphic" in2="glow" mode="normal" />
    `);
  
  // 隐藏原始元素
  element1.style("opacity", 0.3);
  element2.style("opacity", 0.3);
  
  // 创建第一个移动元素的副本
  const animElement1 = animationGroup.append("g")
    .attr("class", "anim-element")
    .attr("transform", `translate(${x1}, 0)`);
  
  animElement1.append("rect")
    .attr("width", elementWidth)
    .attr("height", elementWidth)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", element1.select("rect").attr("fill") || "#4caf50")
    .attr("filter", `url(#${filterId})`)
    .attr("stroke", "#282c34")
    .attr("stroke-width", 1);
  
  animElement1.append("text")
    .attr("x", elementWidth / 2)
    .attr("y", elementWidth / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#282c34")
    .attr("font-weight", "bold")
    .text(val1);
  
  // 创建第二个移动元素的副本
  const animElement2 = animationGroup.append("g")
    .attr("class", "anim-element")
    .attr("transform", `translate(${x2}, 0)`);
  
  animElement2.append("rect")
    .attr("width", elementWidth)
    .attr("height", elementWidth)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", element2.select("rect").attr("fill") || "#f44336")
    .attr("filter", `url(#${filterId})`)
    .attr("stroke", "#282c34")
    .attr("stroke-width", 1);
  
  animElement2.append("text")
    .attr("x", elementWidth / 2)
    .attr("y", elementWidth / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#282c34")
    .attr("font-weight", "bold")
    .text(val2);
  
  // 执行单个动画，不嵌套transition
  const duration = 800;
  
  // 第一个元素动画
  const transitionFirst = animElement1.transition()
    .duration(duration)
    .ease(d3.easeCubicInOut);
  
  transitionFirst.attrTween("transform", function() {
    return function(t: number) {
      const y = Math.sin(Math.PI * t) * -40; // 负值表示向上运动
      const x = x1 + (x2 - x1) * t;
      const rotate = 180 * Math.sin(Math.PI * t * 0.5);
      return `translate(${x}, ${y}) rotate(${rotate}, ${elementWidth/2}, ${elementWidth/2})`;
    };
  });
  
  // 第二个元素动画
  const transitionSecond = animElement2.transition()
    .duration(duration)
    .ease(d3.easeCubicInOut);
  
  transitionSecond.attrTween("transform", function() {
    return function(t: number) {
      const y = Math.sin(Math.PI * t) * 40; // 正值表示向下运动
      const x = x2 + (x1 - x2) * t;
      const rotate = -180 * Math.sin(Math.PI * t * 0.5);
      return `translate(${x}, ${y}) rotate(${rotate}, ${elementWidth/2}, ${elementWidth/2})`;
    };
  });
  
  // 在动画完成后更新元素位置并清理
  transitionSecond.on("end", function() {
    // 恢复原始元素，更新位置
    element1.attr("transform", `translate(${x2}, 0)`)
           .style("opacity", 1);
    
    element2.attr("transform", `translate(${x1}, 0)`)
           .style("opacity", 1);
    
    // 显示完成效果
    const finishEffect = arrayGroup.append("g").attr("class", "finish-effect");
    
    // 第一个位置的效果
    finishEffect.append("circle")
      .attr("cx", x1 + elementWidth/2)
      .attr("cy", elementHeight/2)
      .attr("r", elementWidth/2)
      .attr("fill", "#f44336")
      .attr("opacity", 0.7)
      .transition()
      .duration(400)
      .attr("r", elementWidth)
      .attr("opacity", 0)
      .remove();
    
    // 第二个位置的效果
    finishEffect.append("circle")
      .attr("cx", x2 + elementWidth/2)
      .attr("cy", elementHeight/2)
      .attr("r", elementWidth/2)
      .attr("fill", "#4caf50")
      .attr("opacity", 0.7)
      .transition()
      .duration(400)
      .attr("r", elementWidth)
      .attr("opacity", 0)
      .on("end", function() {
        // 动画完成后，执行一些放大缩小的效果
        element1.select("rect")
          .transition()
          .duration(300)
          .attr("transform", "scale(1.1)")
          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
        
        element2.select("rect")
          .transition()
          .duration(300)
          .attr("transform", "scale(1.1)")
          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
        
        // 清理所有临时元素
        animationGroup.remove();
        finishEffect.remove();
        defs.remove();
      });
  });
};

/**
 * 应用高亮、比较或移动动画
 */
export const applyElementAnimation = (
  cells: d3.Selection<SVGGElement, any, SVGGElement, unknown>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  phase: string | undefined,
  elementWidth: number
) => {
  if (phase === 'highlight') {
    // 高亮动画
    cells.filter(d => d.state.highlighted)
      .select("rect")
      .transition()
      .duration(300)
      .attr("transform", "scale(1.1)")
      .transition()
      .duration(300)
      .attr("transform", "scale(1)");
  } else if (phase === 'compare') {
    // 比较动画
    cells.filter(d => d.state.comparing)
      .select("rect")
      .transition()
      .duration(400)
      .attr("fill", "#ffeb3b")
      .transition()
      .duration(400)
      .attr("fill", d => d.isZero ? "#777" : "#61dafb");
  } else if (phase === 'swap-start') {
    // 交换开始动画
    cells.filter(d => d.state.swapping)
      .select("rect")
      .transition()
      .duration(300)
      .attr("fill", "#ff5252")
      .attr("transform", "scale(1.1)");
  } else if (phase === 'move') {
    // 指针移动动画
    svg.selectAll(".pointer.slow")
      .transition()
      .duration(300)
      .attr("transform", `translate(${elementWidth/2}, 0)`)
      .transition()
      .duration(300)
      .attr("transform", "translate(0, 0)");
  }
}; 