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
  
  // 创建唯一ID的滤镜
  const filterId = "swap-glow-" + Date.now();
  const defs = arrayGroup.append("defs");
  defs.append("filter")
    .attr("id", filterId)
    .attr("x", "-20%")
    .attr("y", "-20%")
    .attr("width", "140%")
    .attr("height", "140%")
    .html(`
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feFlood flood-color="#ff5252" flood-opacity="0.5" result="color" />
      <feComposite in="color" in2="blur" operator="in" result="glow" />
      <feBlend in="SourceGraphic" in2="glow" mode="normal" />
    `);
  
  // 备份元素原始位置和数据
  const data1 = element1.datum();
  const data2 = element2.datum();
  
  // 创建元素副本
  const animationGroup = arrayGroup.append("g").attr("class", "animation-group");
  
  // 第一个元素副本
  const clone1 = animationGroup.append("g")
    .attr("class", "element-clone")
    .attr("transform", `translate(${x1}, 0)`);
    
  clone1.append("rect")
    .attr("width", elementWidth)
    .attr("height", elementHeight)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", element1.select("rect").attr("fill"))
    .attr("stroke", "#282c34")
    .attr("filter", `url(#${filterId})`)
    .attr("stroke-width", 1);
    
  clone1.append("text")
    .attr("x", elementWidth / 2)
    .attr("y", elementHeight / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#282c34")
    .attr("font-weight", "bold")
    .text(val1);
  
  // 第二个元素副本
  const clone2 = animationGroup.append("g")
    .attr("class", "element-clone")
    .attr("transform", `translate(${x2}, 0)`);
    
  clone2.append("rect")
    .attr("width", elementWidth)
    .attr("height", elementHeight)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", element2.select("rect").attr("fill"))
    .attr("stroke", "#282c34")
    .attr("filter", `url(#${filterId})`)
    .attr("stroke-width", 1);
    
  clone2.append("text")
    .attr("x", elementWidth / 2)
    .attr("y", elementHeight / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#282c34")
    .attr("font-weight", "bold")
    .text(val2);
  
  // 隐藏原始元素
  element1.style("opacity", 0);
  element2.style("opacity", 0);
  
  // 执行单一动画
  const duration = 600;
  
  // 同时移动两个克隆元素
  clone1.transition()
    .duration(duration)
    .attr("transform", `translate(${x2}, 0)`)
    .ease(d3.easeBackInOut);
    
  clone2.transition()
    .duration(duration)
    .attr("transform", `translate(${x1}, 0)`)
    .ease(d3.easeBackInOut)
    .on("end", function() {
      // 更新数据：关键步骤
      element1.datum(d => ({...d, index: idx2, x: x2}));
      element2.datum(d => ({...d, index: idx1, x: x1}));
      
      // 更新位置
      element1.attr("transform", `translate(${x2}, 0)`)
              .style("opacity", 1);
      element2.attr("transform", `translate(${x1}, 0)`)
              .style("opacity", 1);
      
      // 更新索引标签
      element1.select(".index-label").text(idx2);
      element2.select(".index-label").text(idx1);
      
      // 添加高亮效果
      element1.select("rect")
        .transition()
        .duration(250)
        .attr("transform", "scale(1.1)")
        .transition()
        .duration(250)
        .attr("transform", "scale(1)");
      
      element2.select("rect")
        .transition()
        .duration(250)
        .attr("transform", "scale(1.1)")
        .transition()
        .duration(250)
        .attr("transform", "scale(1)");
      
      // 清理
      animationGroup.remove();
      defs.remove();
      
      // 添加到控制台的调试信息
      console.log('交换完成', {
        '元素1新位置': x2,
        '元素2新位置': x1,
        '元素1数据': element1.datum(),
        '元素2数据': element2.datum()
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