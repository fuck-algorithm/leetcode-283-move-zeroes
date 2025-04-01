import * as d3 from 'd3';

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
 * 应用交换动画
 */
export const applySwapAnimation = (
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  slowIndex: number,
  fastIndex: number,
  paths: SVGPathElement[],
  elementWidth: number,
  elementPadding: number
) => {
  const duration = 1500; // 增加动画时长，更流畅
  const elementHeight = 50; // 默认元素高度
  const elements = container.selectAll('.array-element');
  const slowElement = elements.filter((_, i) => i === slowIndex);
  const fastElement = elements.filter((_, i) => i === fastIndex);

  // 添加动态渐变色效果
  const createDynamicGradient = (id: string, colors: string[]) => {
    const gradient = container.append('defs')
      .append('linearGradient')
      .attr('id', id)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    colors.forEach((color, i) => {
      gradient.append('stop')
        .attr('offset', `${i * 100 / (colors.length - 1)}%`)
        .attr('stop-color', color);
    });
    
    // 添加动画效果
    gradient.append('animateTransform')
      .attr('attributeName', 'gradientTransform')
      .attr('type', 'rotate')
      .attr('from', '0 0.5 0.5')
      .attr('to', '360 0.5 0.5')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');
      
    return gradient;
  };

  // 创建两种不同的渐变效果
  createDynamicGradient('swap-gradient-slow', ['#FF416C', '#FF4B2B', '#FF9D6C', '#FF6B6B']);
  createDynamicGradient('swap-gradient-fast', ['#1A2980', '#26D0CE', '#21D4FD', '#2979FF']);

  // 创建粒子动画对象 - 增加粒子数量和变化
  const createParticles = (path: SVGPathElement, gradientId: string) => {
    const particleGroup = container.append('g')
      .attr('class', 'particles');
    
    const particleCount = 25; // 增加粒子数量
    const particles: d3.Selection<any, unknown, null, undefined>[] = [];
    
    // 多种粒子形状
    const shapes = [
      (r: number) => `M 0,-${r} L ${r*0.866},${r*0.5} L -${r*0.866},${r*0.5} Z`, // 三角形
      (r: number) => `M -${r},-${r} L ${r},-${r} L ${r},${r} L -${r},${r} Z`, // 正方形
      (r: number) => `M 0,-${r} L ${r*0.587},-${r*0.809} L ${r*0.951},${r*0.309} L ${r*0.587},${r*0.809} L 0,${r} L -${r*0.587},${r*0.809} L -${r*0.951},${r*0.309} L -${r*0.587},-${r*0.809} Z` // 八边形
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 2; // 随机大小
      const shapeIndex = Math.floor(Math.random() * 4); // 随机选择形状
      
      if (shapeIndex < 3) {
        // 使用自定义形状
        const particle = particleGroup.append('path')
          .attr('d', shapes[shapeIndex](size))
          .style('fill', `url(#${gradientId})`)
          .style('opacity', 0);
        particles.push(particle);
      } else {
        // 圆形粒子
        const particle = particleGroup.append('circle')
          .attr('r', size)
          .style('fill', `url(#${gradientId})`)
          .style('opacity', 0);
        particles.push(particle);
      }
    }
    
    return { group: particleGroup, particles };
  };

  // 创建超炫酷的尾迹效果
  const createTrail = (path: SVGPathElement, gradientId: string) => {
    const trailGroup = container.append('g')
      .attr('class', 'trail');
    
    // 主尾迹
    const trail = trailGroup.append('path')
      .attr('d', path.getAttribute('d') || '')
      .style('fill', 'none')
      .style('stroke', `url(#${gradientId})`)
      .style('stroke-width', 5)
      .style('stroke-dasharray', '4,2')
      .style('opacity', 0)
      .style('filter', 'url(#glow-intense)');
    
    // 添加动画
    trail.transition()
      .duration(duration * 0.1)
      .style('opacity', 0.8)
      .transition()
      .duration(duration * 0.9)
      .styleTween('stroke-dashoffset', function() {
        const length = path.getTotalLength();
        return function(t: number) {
          return `${(1 - t) * length}`;
        };
      });
    
    return trailGroup;
  };

  // 为两个元素创建粒子和尾迹
  const slowParticles = createParticles(paths[0], 'swap-gradient-slow');
  const fastParticles = createParticles(paths[1], 'swap-gradient-fast');
  
  const slowTrail = createTrail(paths[0], 'swap-gradient-slow');
  const fastTrail = createTrail(paths[1], 'swap-gradient-fast');

  // 创建更强烈的发光效果
  container.append('defs')
    .append('filter')
    .attr('id', 'glow-intense')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%')
    .html(`
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feFlood flood-color="#ff4b2b" flood-opacity="0.7" result="glow-color-1" />
      <feComposite in="glow-color-1" in2="blur" operator="in" result="glow-1" />
      <feFlood flood-color="#2979ff" flood-opacity="0.7" result="glow-color-2" />
      <feComposite in="glow-color-2" in2="blur" operator="in" result="glow-2" />
      <feMerge>
        <feMergeNode in="glow-1" />
        <feMergeNode in="glow-2" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    `);

  // 元素缩放和旋转动画 - 更复杂的变换
  slowElement.transition()
    .duration(duration * 0.2)
    .style('opacity', 0.95)
    .attr('transform', `translate(${slowIndex * (elementWidth + elementPadding)},0) scale(1.15) rotate(-5)`)
    .transition()
    .duration(duration * 0.8)
    .attrTween('transform', function() {
      const path = paths[0];
      return function(t: number) {
        // 获取路径上的点
        const point = path.getPointAtLength(path.getTotalLength() * t);
        // 添加动态旋转和缩放效果
        const rotation = Math.sin(t * Math.PI * 4) * 10;
        const scale = 1 + Math.sin(t * Math.PI * 2) * 0.1;
        // 根据路径位置平移元素
        return `translate(${point.x - elementWidth / 2},${point.y - elementHeight / 2}) rotate(${rotation}) scale(${scale})`;
      };
    })
    .on('end', () => {
      // 设置到最终位置并保持在那里
      slowElement
        .transition()
        .duration(duration * 0.2)
        .attr('transform', `translate(${fastIndex * (elementWidth + elementPadding)},0) scale(1)`)
        .style('opacity', 1);
    });

  fastElement.transition()
    .duration(duration * 0.2)
    .style('opacity', 0.95)
    .attr('transform', `translate(${fastIndex * (elementWidth + elementPadding)},0) scale(1.15) rotate(5)`)
    .transition()
    .duration(duration * 0.8)
    .attrTween('transform', function() {
      const path = paths[1];
      return function(t: number) {
        const point = path.getPointAtLength(path.getTotalLength() * t);
        const rotation = Math.sin(t * Math.PI * 4) * 10;
        const scale = 1 + Math.sin(t * Math.PI * 2) * 0.1;
        return `translate(${point.x - elementWidth / 2},${point.y - elementHeight / 2}) rotate(${rotation}) scale(${scale})`;
      };
    })
    .on('end', () => {
      // 设置到最终位置并保持在那里
      fastElement
        .transition()
        .duration(duration * 0.2)
        .attr('transform', `translate(${slowIndex * (elementWidth + elementPadding)},0) scale(1)`)
        .style('opacity', 1);
    });

  // 动画粒子沿路径移动 - 每个粒子都有独特的效果
  slowParticles.particles.forEach((particle, i) => {
    const delay = i * (duration / slowParticles.particles.length * 0.5);
    const particleDuration = duration * 0.7 + Math.random() * 300;
    
    particle
      .transition()
      .delay(delay)
      .duration(particleDuration)
      .style('opacity', () => Math.random() * 0.4 + 0.6)
      .attrTween('transform', function() {
        return function(t: number) {
          const pathLength = paths[0].getTotalLength();
          const point = paths[0].getPointAtLength(pathLength * t);
          const angle = (t * 720) % 360; // 旋转角度
          const scale = 0.5 + Math.sin(t * Math.PI * 4) * 0.5; // 缩放效果
          
          return `translate(${point.x}, ${point.y}) rotate(${angle}) scale(${scale})`;
        };
      })
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();
  });

  fastParticles.particles.forEach((particle, i) => {
    const delay = i * (duration / fastParticles.particles.length * 0.5);
    const particleDuration = duration * 0.7 + Math.random() * 300;
    
    particle
      .transition()
      .delay(delay)
      .duration(particleDuration)
      .style('opacity', () => Math.random() * 0.4 + 0.6)
      .attrTween('transform', function() {
        return function(t: number) {
          const pathLength = paths[1].getTotalLength();
          const point = paths[1].getPointAtLength(pathLength * t);
          const angle = (t * 720) % 360;
          const scale = 0.5 + Math.sin(t * Math.PI * 4) * 0.5;
          
          return `translate(${point.x}, ${point.y}) rotate(${angle}) scale(${scale})`;
        };
      })
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();
  });

  // 清理粒子组和尾迹
  slowParticles.group.transition()
    .delay(duration)
    .remove();
  
  fastParticles.group.transition()
    .delay(duration)
    .remove();
    
  slowTrail.transition()
    .delay(duration)
    .remove();
    
  fastTrail.transition()
    .delay(duration)
    .remove();

  // 添加爆炸效果
  const createExplosion = (x: number, y: number, color: string) => {
    const explosionGroup = container.append('g')
      .attr('class', 'explosion')
      .attr('transform', `translate(${x}, ${y})`);
    
    // 创建放射状光芒
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * 360;
      const length = Math.random() * 20 + 15;
      
      explosionGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', length * Math.cos(angle * Math.PI / 180))
        .attr('y2', length * Math.sin(angle * Math.PI / 180))
        .style('stroke', color)
        .style('stroke-width', 2)
        .style('opacity', 0)
        .transition()
        .duration(300)
        .style('opacity', 0.8)
        .attr('x2', length * 1.5 * Math.cos(angle * Math.PI / 180))
        .attr('y2', length * 1.5 * Math.sin(angle * Math.PI / 180))
        .transition()
        .duration(200)
        .style('opacity', 0)
        .remove();
    }
    
    // 创建圆形波
    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
      explosionGroup.append('circle')
        .attr('r', 2)
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 3 - i * 0.5)
        .style('opacity', 0)
        .transition()
        .delay(i * 100)
        .duration(400)
        .style('opacity', 0.7)
        .attr('r', 30 + i * 10)
        .transition()
        .duration(300)
        .style('opacity', 0)
        .remove();
    }
    
    explosionGroup.transition()
      .delay(700)
      .remove();
  };

  // 在交换结束时添加爆炸效果
  setTimeout(() => {
    const slowX = slowIndex * (elementWidth + elementPadding) + elementWidth / 2;
    const slowY = elementHeight / 2;
    const fastX = fastIndex * (elementWidth + elementPadding) + elementWidth / 2;
    const fastY = elementHeight / 2;
    
    createExplosion(fastX, slowY, '#FF4B2B');
    createExplosion(slowX, fastY, '#2979FF');
  }, duration * 0.8);

  // 添加闪光效果 - 更强烈和动态
  const addFlashEffect = (index: number, color: string) => {
    const flash = container.append('rect')
      .attr('width', elementWidth)
      .attr('height', elementHeight)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('x', index * (elementWidth + elementPadding))
      .attr('y', 0)
      .style('fill', color)
      .style('opacity', 0)
      .style('filter', 'url(#glow-intense)');
    
    flash.transition()
      .delay(duration * 0.8)
      .duration(100)
      .style('opacity', 0.7)
      .transition()
      .duration(300)
      .style('opacity', 0)
      .remove();
  };
  
  addFlashEffect(fastIndex, 'rgba(255, 75, 43, 0.7)');
  addFlashEffect(slowIndex, 'rgba(41, 121, 255, 0.7)');
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