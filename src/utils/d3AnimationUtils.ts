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
  elementPadding: number
) => {
  const x1 = idx1 * (elementWidth + elementPadding);
  const x2 = idx2 * (elementWidth + elementPadding);
  const newX1 = newIdx1 * (elementWidth + elementPadding);
  const newX2 = newIdx2 * (elementWidth + elementPadding);
  
  // 应用交换动画到第一个元素
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
  
  // 应用交换动画到第二个元素
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