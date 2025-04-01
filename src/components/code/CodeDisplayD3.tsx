import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './CodeDisplay.css';

// 使用相同的代码示例，从原始组件复制
const codeExamples: { [key: string]: string } = {
  javascript: `/**
 * LeetCode 283. 移动零
 * @param {number[]} nums
 * @return {void} 原地修改数组
 */
function moveZeroes(nums) {
  // 双指针法
  let nonZeroIndex = 0;
  
  // 第一步：将所有非零元素移到数组前部
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[nonZeroIndex] = nums[i];
      nonZeroIndex++;
    }
  }
  
  // 第二步：将剩余位置填充0
  for (let i = nonZeroIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
  
  return nums; // 返回修改后的数组（非必须）
}`
};

interface CodeDisplayD3Props {
  currentStep: number;
  highlightedLines: number[];
  compactMode?: boolean;
}

const CodeDisplayD3: React.FC<CodeDisplayD3Props> = ({ 
  currentStep, 
  highlightedLines,
  compactMode = false
}) => {
  const [selectedLanguage] = useState<string>('javascript');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // D3实现代码高亮和动画
  useEffect(() => {
    if (!containerRef.current) return;
    
    const selectedCode = codeExamples[selectedLanguage] || '';
    const codeLines = selectedCode.split('\n');
    
    // 清除现有内容
    const container = d3.select(containerRef.current);
    container.selectAll("*").remove();
    
    // 创建代码容器
    const codeContainer = container
      .append("div")
      .attr("class", "code-content");
    
    // 添加行号容器
    const lineNumbers = codeContainer
      .append("div")
      .attr("class", "line-numbers");
    
    // 添加代码展示容器
    const codeDisplay = codeContainer
      .append("div")
      .attr("class", "code-lines");
    
    // 生成行号
    lineNumbers.selectAll(".line-number")
      .data(codeLines)
      .enter()
      .append("div")
      .attr("class", (_, i) => `line-number ${highlightedLines.includes(i + 1) ? 'highlighted' : ''}`)
      .text((_, i) => i + 1);
    
    // 生成代码行
    const codeLineElements = codeDisplay.selectAll(".code-line")
      .data(codeLines)
      .enter()
      .append("div")
      .attr("class", (_, i) => `code-line ${highlightedLines.includes(i + 1) ? 'highlighted' : ''}`)
      .html((d) => {
        // 简化的语法高亮 (仅支持JavaScript)
        let line = d;
        
        // 注释高亮
        if (line.includes('//') || line.includes('/*') || line.includes('*/')) {
          const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
          line = line.replace(commentRegex, '<span class="comment">$1</span>');
        }
        
        // 关键字高亮
        const keywords = ['function', 'let', 'const', 'var', 'return', 'if', 'else', 'for', 'while'];
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          line = line.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // 数字高亮
        line = line.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
        
        // 字符串高亮
        line = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');
        
        return line;
      });
    
    // 添加动画效果
    if (highlightedLines.length > 0) {
      codeLineElements
        .filter((_, i) => highlightedLines.includes(i + 1))
        .transition()
        .duration(300)
        .style("background-color", "#f8f9fa")
        .transition()
        .duration(300)
        .style("background-color", "#e2f3ff");
    }
    
  }, [selectedLanguage, highlightedLines, currentStep]);
  
  return (
    <div className={`code-display ${compactMode ? 'compact' : ''}`}>
      <div className="code-header">
        <h3>算法实现</h3>
        <div className="language-selector">
          <span>JavaScript</span>
        </div>
      </div>
      <div className="code-container" ref={containerRef}></div>
    </div>
  );
};

export default CodeDisplayD3; 