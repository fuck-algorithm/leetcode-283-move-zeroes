import * as d3 from 'd3';
import { getTranslation, formatTranslation } from '../i18n';

/**
 * 创建交换路径
 */
export const createSwapPaths = (startX: number, endX: number, height: number): SVGPathElement[] => {
  const paths: SVGPathElement[] = [];
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  // 创建曲线路径而不是直线，使用更动态的曲线
  const offsetY = height * 0.6; // 增加曲线的弯曲程度

  // 创建第一条路径（从起点到终点，上方曲线）- 使用三阶贝塞尔曲线，更流畅
  const path1Data = d3.path();
  path1Data.moveTo(startX, height / 2);
  path1Data.bezierCurveTo(
    startX + (endX - startX) * 0.3, height / 2 - offsetY, 
    startX + (endX - startX) * 0.7, height / 2 - offsetY, 
    endX, height / 2
  );
  path1.setAttribute('d', path1Data.toString());
  paths.push(path1);

  // 创建第二条路径（从终点到起点，下方曲线）
  const path2Data = d3.path();
  path2Data.moveTo(endX, height / 2);
  path2Data.bezierCurveTo(
    endX - (endX - startX) * 0.3, height / 2 + offsetY, 
    endX - (endX - startX) * 0.7, height / 2 + offsetY, 
    startX, height / 2
  );
  path2.setAttribute('d', path2Data.toString());
  paths.push(path2);

  return paths;
};

/**
 * 创建增强的高亮效果
 * @param container 容器元素
 * @param element 要高亮的元素
 * @param color 高亮颜色
 * @param duration 动画持续时间
 */
export const createHighlightEffect = (
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  element: d3.Selection<any, unknown, SVGGElement, unknown>,
  color: string = '#ff6a00',
  duration: number = 500
) => {
  // 1. 添加脉动效果
  element.select('rect')
    .transition()
    .duration(duration / 2)
    .style('stroke', color)
    .style('stroke-width', 4)
    .attr('transform', 'scale(1.15)')
    .transition()
    .duration(duration / 2)
    .style('stroke-width', 3)
    .attr('transform', 'scale(1)');

  // 2. 添加光环效果
  const elementNode = element.node();
  if (elementNode) {
    const rect = element.select('rect');
    const bbox = (elementNode as SVGGElement).getBBox();
    
    // 创建一个临时的发光效果
    const glow = container.append('rect')
      .attr('class', 'temp-highlight-glow')
      .attr('x', bbox.x - 5)
      .attr('y', bbox.y - 5)
      .attr('width', bbox.width + 10)
      .attr('height', bbox.height + 10)
      .attr('rx', rect.attr('rx'))
      .attr('ry', rect.attr('ry'))
      .style('fill', 'none')
      .style('stroke', color)
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,3')
      .style('opacity', 0)
      .style('pointer-events', 'none');
    
    // 添加淡入淡出动画
    glow.transition()
      .duration(duration / 2)
      .style('opacity', 0.8)
      .transition()
      .duration(duration / 2)
      .style('opacity', 0)
      .on('end', function() {
        d3.select(this).remove(); // 动画结束后移除
      });
  }

  return element;
};

/**
 * 创建元素克隆
 * @param container 容器元素
 * @param element 要克隆的元素
 * @param targetPosition 目标位置的索引
 * @param elementWidth 元素宽度
 * @param elementPadding 元素间距
 */
export const createElementClone = (
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  element: d3.Selection<any, unknown, SVGGElement, unknown>,
  targetPosition: number,
  elementWidth: number,
  elementPadding: number
) => {
  // 获取原始元素节点
  const originalNode = element.node() as any;
  if (!originalNode) return null;
  
  // 创建克隆元素组
  const clone = container.append('g')
    .attr('class', 'element-clone')
    .attr('transform', `translate(${targetPosition * (elementWidth + elementPadding)},0)`)
    .style('opacity', 0)
    .style('pointer-events', 'none');
  
  // 复制矩形
  const rect = element.select('rect');
  clone.append('rect')
    .attr('width', rect.attr('width'))
    .attr('height', rect.attr('height'))
    .attr('rx', rect.attr('rx'))
    .attr('ry', rect.attr('ry'))
    .style('fill', rect.style('fill'))
    .style('stroke', '#ffffff')
    .style('stroke-width', 2)
    .style('stroke-dasharray', '4,2')
    .style('filter', 'url(#glow)');
  
  // 复制文本
  const text = element.select('text');
  clone.append('text')
    .attr('x', text.attr('x'))
    .attr('y', text.attr('y'))
    .attr('dy', text.attr('dy'))
    .attr('text-anchor', text.attr('text-anchor'))
    .text(text.text())
    .style('font-size', text.style('font-size'))
    .style('font-weight', 'bold')
    .style('fill', '#ffffff');
  
  // 应用淡入淡出动画
  clone.transition()
    .duration(300)
    .style('opacity', 0.7)
    .transition()
    .duration(300)
    .style('opacity', 0.4)
    .transition()
    .duration(300)
    .style('opacity', 0.7);
  
  return clone;
};

/**
 * 应用交换动画效果
 * 该函数处理两个元素之间的交换动画，包括路径动画和元素移动
 * @param arrayGroup D3选择的数组元素组
 * @param slowIndex 慢指针索引
 * @param fastIndex 快指针索引 
 * @param paths 预先创建的SVG路径元素数组
 * @param elementWidth 元素宽度
 * @param elementPadding 元素间距
 */
export const applySwapAnimation = (
  arrayGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  slowIndex: number,
  fastIndex: number,
  paths: SVGPathElement[],
  elementWidth: number,
  elementPadding: number
) => {
  const elementHeight = 50; // 添加默认的元素高度值
  console.log(`开始交换动画: slow=${slowIndex}, fast=${fastIndex}`);

  // 关键修复：确认我们是否有正确的交换元素
  // 查找带有data-swapping属性的元素，这些是在ArrayVisualizerD3Enhanced中标记的
  const slowElement = arrayGroup.select(`g.array-element[data-swapping="slow"]`);
  const fastElement = arrayGroup.select(`g.array-element[data-swapping="fast"]`);

  // 记录状态，帮助调试
  console.log(`查找交换元素: slow=${!slowElement.empty()}, fast=${!fastElement.empty()}`);

  // 如果无法找到标记的元素，回退到使用索引查找
  // 使用更宽松的类型定义
  let sourceElement: d3.Selection<any, unknown, any, any> = 
    !slowElement.empty() ? slowElement : arrayGroup.selectAll('.array-element').filter((_, i) => i === slowIndex);
  let targetElement: d3.Selection<any, unknown, any, any> = 
    !fastElement.empty() ? fastElement : arrayGroup.selectAll('.array-element').filter((_, i) => i === fastIndex);

  // 确保我们有可用的元素
  if (sourceElement.empty() || targetElement.empty()) {
    console.error("交换动画失败：无法找到源元素或目标元素");
    return;
  }

  // 获取要交换的元素的值，用于显示说明文字
  let sourceValue = 0;
  let targetValue = 0;
  
  sourceElement.each(function() {
    const d = d3.select(this).datum() as any;
    sourceValue = d ? d.value : 0;
    console.log("源元素数据:", d ? {value: d.value, index: d.index, swapping: d.state?.swapping} : "无数据");
  });
  
  targetElement.each(function() {
    const d = d3.select(this).datum() as any;
    targetValue = d ? d.value : 0;
    console.log("目标元素数据:", d ? {value: d.value, index: d.index, swapping: d.state?.swapping} : "无数据");
  });

  // 添加高亮效果
  sourceElement
    .selectAll('rect')
    .style('stroke', '#0000ff')
    .style('stroke-width', 3)
    .style('stroke-dasharray', '5,3');

  targetElement
    .selectAll('rect')
    .style('stroke', '#0000ff')
    .style('stroke-width', 3)
    .style('stroke-dasharray', '5,3');

  // 计算起始位置和目标位置
  const sourceTransform = sourceElement.attr('transform');
  const targetTransform = targetElement.attr('transform');
  
  console.log(`元素变换: 源=${sourceTransform}, 目标=${targetTransform}`);

  // 改进语言检测：优先从localStorage中获取用户设置的语言
  let currentLanguage = 'en';
  try {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage) {
      currentLanguage = savedLanguage;
    } else if (document.documentElement.lang) {
      currentLanguage = document.documentElement.lang;
    } else if (navigator.language) {
      // 如果浏览器语言以中文开头，则使用中文
      currentLanguage = navigator.language.startsWith('zh') ? 'zh' : 'en';
    }
    console.log(`当前语言设置: ${currentLanguage}`);
  } catch (e) {
    console.error("无法获取语言设置:", e);
  }
  
  // 直接创建文本标签的辅助函数
  const createSwapText = (text: string, color: string, yOffset: number) => {
    return swapTextGroup.append('text')
      .attr('x', textX)
      .attr('y', textY + yOffset)
      .attr('text-anchor', 'middle')
      .attr('dy', '0em')
      .attr('class', 'swap-text')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', color)
      .style('opacity', 0)
      .text(text);
  };
  
  // 添加交换说明文字
  const swapTextGroup = arrayGroup.append('g')
    .attr('class', 'swap-text-group');
  
  // 计算文字位置 - 两个交换元素的中间位置
  const getPositionFromTransform = (transformStr: string): {x: number, y: number} => {
    const match = transformStr.match(/translate\(([^,]+),([^)]+)\)/);
    if (match && match.length >= 3) {
      return {
        x: parseFloat(match[1]) + elementWidth / 2,
        y: parseFloat(match[2])
      };
    }
    return {x: 0, y: 0};
  };
  
  const sourcePos = getPositionFromTransform(sourceTransform);
  const targetPos = getPositionFromTransform(targetTransform);
  const textX = (sourcePos.x + targetPos.x) / 2;
  const textY = sourcePos.y - 30; // 文字显示在元素上方
  
  // 获取正确的本地化文本，确保中英文显示正确
  const startTextContent = formatTranslation('animation.swapElements', [sourceValue, targetValue], currentLanguage);
  console.log(`交换开始文本 (${currentLanguage}): ${startTextContent}`);
  
  // 添加交换开始文字
  const startText = createSwapText(startTextContent, '#ff5722', 0);
  
  startText.transition()
    .duration(400)
    .style('opacity', 1)
    .transition()
    .delay(1000)
    .duration(400)
    .style('opacity', 0.7);

  // 创建克隆以实现预览效果
  const createClone = (element: d3.Selection<any, unknown, any, any>) => {
    const node = element.node();
    if (!node) return null;
    const clone = node.cloneNode(true) as SVGGElement;
    // 添加克隆标识
    clone.setAttribute('class', 'array-element clone');
    // 确保克隆体在原始元素之上
    clone.style.opacity = '0.7';
    return clone;
  };

  // 为源和目标创建克隆
  const sourceClone = createClone(sourceElement);
  const targetClone = createClone(targetElement);
  
  // 如果克隆创建成功，添加到DOM
  if (sourceClone && targetClone) {
    arrayGroup.node()?.appendChild(sourceClone);
    arrayGroup.node()?.appendChild(targetClone);

    // 设置克隆的初始位置
    d3.select(sourceClone).attr('transform', sourceTransform);
    d3.select(targetClone).attr('transform', targetTransform);

    // 创建动态渐变
    const createDynamicGradient = (id: string, color: string) => {
      const gradientId = `clone-gradient-${id}`;
      const gradient = arrayGroup.append('defs')
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.5);
      
      return gradientId;
    };

    // 为克隆元素添加特殊效果
    const sourceGradientId = createDynamicGradient('source', '#4285f4');
    const targetGradientId = createDynamicGradient('target', '#34a853');
    
    d3.select(sourceClone).selectAll('rect')
      .style('fill', `url(#${sourceGradientId})`)
      .style('stroke', '#4285f4')
      .style('stroke-width', 2);
    
    d3.select(targetClone).selectAll('rect')
      .style('fill', `url(#${targetGradientId})`)
      .style('stroke', '#34a853')
      .style('stroke-width', 2);

    // 设置动画时长 - 延长到2000毫秒，以便更好地观察
    const duration = 2000; // 从1000毫秒增加到2000毫秒
    
    // 执行克隆元素的路径动画
    d3.select(sourceClone)
      .transition()
      .duration(duration)
      .attrTween('transform', () => {
        return function(t: number) {
          const p = paths[0].getPointAtLength(t * paths[0].getTotalLength());
          return `translate(${p.x - elementWidth / 2},${p.y - elementHeight / 2})`;
        };
      })
      .on('end', function() {
        // 移除克隆元素
        this.remove();
      });
    
    d3.select(targetClone)
      .transition()
      .duration(duration)
      .attrTween('transform', () => {
        return function(t: number) {
          const p = paths[1].getPointAtLength(t * paths[1].getTotalLength());
          return `translate(${p.x - elementWidth / 2},${p.y - elementHeight / 2})`;
        };
      })
      .on('end', function() {
        this.remove();
        
        // 动画结束后，更新原始元素的最终位置
        // 注意：这里使用了索引值乘以宽度来计算位置
        sourceElement.attr('transform', targetTransform);
        targetElement.attr('transform', sourceTransform);
        
        // 交换完成后的确认高亮
        sourceElement
          .selectAll('rect')
          .style('stroke', '#00cc00')
          .style('stroke-width', 2)
          .style('stroke-dasharray', null);
        
        targetElement
          .selectAll('rect')
          .style('stroke', '#00cc00')
          .style('stroke-width', 2)
          .style('stroke-dasharray', null);

        // 添加交换完成文字
        const completeTextContent = formatTranslation('animation.elementsSwapped', [sourceValue, targetValue], currentLanguage);
        console.log(`交换完成文本 (${currentLanguage}): ${completeTextContent}`);
        
        const completeText = createSwapText(completeTextContent, '#4caf50', 25);
        
        completeText.transition()
          .duration(400) // 延长文字淡入时间
          .style('opacity', 1)
          .transition()
          .delay(1200) // 延长文字显示时间
          .duration(400) // 延长文字淡出时间
          .style('opacity', 0)
          .on('end', function() {
            // 动画完全结束后移除文字组
            swapTextGroup.remove();
          });

        console.log("交换动画完成");
      });
  } else {
    console.error("无法创建克隆元素");
  }
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