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
  
  // 添加轨迹路径 - 使路径可见增强交换体验
  const path1 = animationGroup.append("path")
    .attr("d", () => {
      const curve = d3.path();
      curve.moveTo(x1 + elementWidth/2, elementHeight/2);
      curve.bezierCurveTo(
        x1 + elementWidth/2, -30, 
        x2 + elementWidth/2, -30, 
        x2 + elementWidth/2, elementHeight/2
      );
      return curve.toString();
    })
    .attr("fill", "none")
    .attr("stroke", "#4caf50")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,3")
    .attr("opacity", 0)
    .transition()
    .duration(200)
    .attr("opacity", 0.6);
    
  const path2 = animationGroup.append("path")
    .attr("d", () => {
      const curve = d3.path();
      curve.moveTo(x2 + elementWidth/2, elementHeight/2);
      curve.bezierCurveTo(
        x2 + elementWidth/2, elementHeight + 30, 
        x1 + elementWidth/2, elementHeight + 30, 
        x1 + elementWidth/2, elementHeight/2
      );
      return curve.toString();
    })
    .attr("fill", "none")
    .attr("stroke", "#f44336")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,3")
    .attr("opacity", 0)
    .transition()
    .duration(200)
    .attr("opacity", 0.6);
  
  // 创建第一个移动元素的副本 - 增加阴影和发光效果
  const animElement1 = animationGroup.append("g")
    .attr("class", "anim-element")
    .attr("transform", `translate(${x1}, 0)`);
  
  // 添加阴影效果
  animElement1.append("rect")
    .attr("width", elementWidth)
    .attr("height", elementWidth)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", element1.select("rect").attr("fill") || "#4caf50")
    .attr("filter", "url(#glow-effect)")
    .attr("stroke", "#282c34")
    .attr("stroke-width", 1)
    .attr("opacity", 0.95);
  
  // 添加第一个元素的文本
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
  
  // 添加阴影效果
  animElement2.append("rect")
    .attr("width", elementWidth)
    .attr("height", elementWidth)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", element2.select("rect").attr("fill") || "#f44336")
    .attr("filter", "url(#glow-effect)")
    .attr("stroke", "#282c34")
    .attr("stroke-width", 1)
    .attr("opacity", 0.95);
  
  // 添加第二个元素的文本
  animElement2.append("text")
    .attr("x", elementWidth / 2)
    .attr("y", elementWidth / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#282c34")
    .attr("font-weight", "bold")
    .text(val2);
  
  // 添加发光滤镜
  const defs = arrayGroup.append("defs");
  defs.append("filter")
    .attr("id", "glow-effect")
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
  
  // 添加运动轨迹指示 - 粒子效果
  const addParticles = (startX: number, endX: number, upwards: boolean) => {
    const particleCount = 15;
    const particleGroup = animationGroup.append("g").attr("class", "particles");
    
    for (let i = 0; i < particleCount; i++) {
      const delay = Math.random() * 400;
      const duration = 600 + Math.random() * 400;
      const startPos = startX + elementWidth/2;
      const endPos = endX + elementWidth/2;
      
      particleGroup.append("circle")
        .attr("cx", startPos)
        .attr("cy", elementHeight/2)
        .attr("r", 1 + Math.random() * 2)
        .attr("fill", upwards ? "#4caf50" : "#f44336")
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 0.7)
        .attrTween("cx", function() {
          return function(t: number) {
            // 转为字符串类型以解决类型错误
            return `${startPos + (endPos - startPos) * t}`;
          };
        })
        .attrTween("cy", function() {
          return function(t: number) {
            const amplitude = 30 + Math.random() * 10;
            const yOffset = upwards ? -amplitude : amplitude;
            // 转为字符串类型以解决类型错误
            return `${elementHeight/2 + Math.sin(Math.PI * t) * yOffset}`;
          };
        })
        .transition()
        .duration(200)
        .attr("opacity", 0)
        .remove();
    }
  };
  
  // 添加粒子效果
  addParticles(x1, x2, true);  // 第一个元素向上移动的粒子
  addParticles(x2, x1, false); // 第二个元素向下移动的粒子
  
  // 隐藏原始元素 (不完全隐藏，只是降低透明度)
  element1.style("opacity", 0.3);
  element2.style("opacity", 0.3);
  
  // 应用交换动画 - 添加缓动效果和旋转
  animElement1.transition()
    .duration(800)
    .ease(d3.easeCubicInOut)
    .attrTween("transform", function() {
      return function(t: number) {
        const y = Math.sin(Math.PI * t) * 40; // 增加弧度
        const x = x1 + (x2 - x1) * t;
        const rotate = 180 * Math.sin(Math.PI * t * 0.5); // 添加旋转
        return `translate(${x}, ${-y}) rotate(${rotate}, ${elementWidth/2}, ${elementWidth/2})`;
      };
    });
  
  animElement2.transition()
    .duration(800)
    .ease(d3.easeCubicInOut)
    .attrTween("transform", function() {
      return function(t: number) {
        const y = Math.sin(Math.PI * t) * 40; // 增加弧度
        const x = x2 + (x1 - x2) * t;
        const rotate = -180 * Math.sin(Math.PI * t * 0.5); // 添加旋转
        return `translate(${x}, ${y}) rotate(${rotate}, ${elementWidth/2}, ${elementWidth/2})`;
      };
    })
    .on("end", function() {
      // 路径淡出
      path1.transition().duration(200).attr("opacity", 0);
      path2.transition().duration(200).attr("opacity", 0);
      
      // 添加成功指示动画
      arrayGroup.append("circle")
        .attr("cx", x1 + elementWidth/2)
        .attr("cy", elementHeight/2)
        .attr("r", elementWidth/2)
        .attr("fill", "#f44336")
        .attr("opacity", 0.7)
        .transition()
        .duration(400)
        .attr("r", elementWidth * 1.5)
        .attr("opacity", 0)
        .remove();
        
      arrayGroup.append("circle")
        .attr("cx", x2 + elementWidth/2)
        .attr("cy", elementHeight/2)
        .attr("r", elementWidth/2)
        .attr("fill", "#4caf50")
        .attr("opacity", 0.7)
        .transition()
        .duration(400)
        .attr("r", elementWidth * 1.5)
        .attr("opacity", 0)
        .remove();
      
      // 移除动画组并添加短暂延迟
      setTimeout(() => {
        animationGroup.remove();
        
        // 恢复并更新原始元素位置，添加强调动画
        element1.transition()
          .duration(300)
          .style("opacity", 1)
          .attr("transform", `translate(${x2}, 0)`)
          .select("rect")
          .transition()
          .duration(300)
          .attr("transform", "scale(1.1)")
          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
          
        element2.transition()
          .duration(300)
          .style("opacity", 1)
          .attr("transform", `translate(${x1}, 0)`)
          .select("rect")
          .transition()
          .duration(300)
          .attr("transform", "scale(1.1)")
          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
      }, 200);
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