import React, { useState, ReactElement } from 'react';
import './CodeDisplay.css';

// 多语言代码示例
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
}`,
  
  python: `"""
LeetCode 283. 移动零
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
请注意 ，必须在不复制数组的情况下原地对数组进行操作。
"""
def moveZeroes(nums: list[int]) -> None:
    """
    原地修改数组
    """
    # 双指针法
    non_zero_index = 0
    
    # 第一步：将所有非零元素移到数组前部
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[non_zero_index] = nums[i]
            non_zero_index += 1
    
    # 第二步：将剩余位置填充0
    for i in range(non_zero_index, len(nums)):
        nums[i] = 0`,
  
  java: `/**
 * LeetCode 283. 移动零
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 */
class Solution {
    public void moveZeroes(int[] nums) {
        // 双指针法
        int nonZeroIndex = 0;
        
        // 第一步：将所有非零元素移到数组前部
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[nonZeroIndex] = nums[i];
                nonZeroIndex++;
            }
        }
        
        // 第二步：将剩余位置填充0
        for (int i = nonZeroIndex; i < nums.length; i++) {
            nums[i] = 0;
        }
    }
}`,
  
  cpp: `/**
 * LeetCode 283. 移动零
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 */
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        // 双指针法
        int nonZeroIndex = 0;
        
        // 第一步：将所有非零元素移到数组前部
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != 0) {
                nums[nonZeroIndex] = nums[i];
                nonZeroIndex++;
            }
        }
        
        // 第二步：将剩余位置填充0
        for (int i = nonZeroIndex; i < nums.size(); i++) {
            nums[i] = 0;
        }
    }
};`,
  
  go: `/**
 * LeetCode 283. 移动零
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 */
func moveZeroes(nums []int) {
    // 双指针法
    nonZeroIndex := 0
    
    // 第一步：将所有非零元素移到数组前部
    for i := 0; i < len(nums); i++ {
        if nums[i] != 0 {
            nums[nonZeroIndex] = nums[i]
            nonZeroIndex++
        }
    }
    
    // 第二步：将剩余位置填充0
    for i := nonZeroIndex; i < len(nums); i++ {
        nums[i] = 0
    }
}`
};

// 语言特定的高亮配置
const languagePatterns: { [key: string]: { type: string, regex: RegExp }[] } = {
  javascript: [
    { type: 'keyword', regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|as|of|in|new|this)\b/ },
    { type: 'number', regex: /\b\d+\b/ },
    { type: 'string', regex: /(["'`])(?:(?=(\\?))\2.)*?\1/ },
    { type: 'comment', regex: /\/\/.*$|\/\*[\s\S]*?\*\// }
  ],
  python: [
    { type: 'keyword', regex: /\b(def|class|if|elif|else|for|while|return|import|from|as|with|in|not|and|or|True|False|None)\b/ },
    { type: 'number', regex: /\b\d+\b/ },
    { type: 'string', regex: /"""[\s\S]*?"""|'''[\s\S]*?'''|(["'])(?:(?=(\\?))\2.)*?\1/ },
    { type: 'comment', regex: /#.*$/ }
  ],
  java: [
    { type: 'keyword', regex: /\b(public|private|protected|class|interface|enum|extends|implements|static|final|void|abstract|new|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|throws|this|super)\b/ },
    { type: 'number', regex: /\b\d+\b/ },
    { type: 'string', regex: /(["'])(?:(?=(\\?))\2.)*?\1/ },
    { type: 'comment', regex: /\/\/.*$|\/\*[\s\S]*?\*\// }
  ],
  cpp: [
    { type: 'keyword', regex: /\b(class|struct|enum|public|private|protected|virtual|static|const|void|int|char|bool|float|double|auto|if|else|for|while|do|switch|case|break|continue|return|try|catch|throw|using|namespace|template|typename)\b/ },
    { type: 'number', regex: /\b\d+\b/ },
    { type: 'string', regex: /(["'])(?:(?=(\\?))\2.)*?\1/ },
    { type: 'comment', regex: /\/\/.*$|\/\*[\s\S]*?\*\// }
  ],
  go: [
    { type: 'keyword', regex: /\b(func|package|import|var|const|type|struct|interface|map|chan|go|select|if|else|for|range|switch|case|default|break|continue|return|defer)\b/ },
    { type: 'number', regex: /\b\d+\b/ },
    { type: 'string', regex: /(["'`])(?:(?=(\\?))\2.)*?\1/ },
    { type: 'comment', regex: /\/\/.*$|\/\*[\s\S]*?\*\// }
  ]
};

interface CodeDisplayProps {
  currentStep: number;
  highlightedLines: number[];
  compactMode?: boolean;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ 
  currentStep, 
  highlightedLines,
  compactMode = false
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  // 优化的词法分析函数
  const tokenizeLine = (line: string, language: string): ReactElement[] => {
    const tokens: ReactElement[] = [];
    let index = 0;

    // 获取当前语言的模式
    const patterns = languagePatterns[language] || languagePatterns.javascript;

    // 检查多行注释或单行注释
    if (
      (language === 'javascript' || language === 'java' || language === 'cpp' || language === 'go') && 
      (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().endsWith('*/'))
    ) {
      return [<span key="comment" className="comment">{line}</span>];
    }

    // Python文档字符串或注释
    if (language === 'python' && (line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith("'''") || line.trim().endsWith('"""') || line.trim().endsWith("'''"))) {
      return [<span key="comment" className="comment">{line}</span>];
    }

    // 处理当前行
    while (index < line.length) {
      // 尝试所有模式匹配
      let matched = false;
      for (const { type, regex } of patterns) {
        regex.lastIndex = index;
        const match = regex.exec(line.slice(index));
        if (match && match.index === 0) {
          tokens.push(
            <span key={`${type}-${index}`} className={type}>
              {match[0]}
            </span>
          );
          index += match[0].length;
          matched = true;
          break;
        }
      }

      // 如果没有匹配，将当前字符作为普通文本
      if (!matched) {
        const nextSpecialCharIndex = Math.min(
          ...patterns.map(p => {
            const idx = line.slice(index).search(p.regex);
            return idx >= 0 ? idx + index : line.length;
          })
        );
        
        const textContent = line.slice(index, nextSpecialCharIndex);
        if (textContent) {
          tokens.push(<span key={`text-${index}`}>{textContent}</span>);
          index = nextSpecialCharIndex;
        } else {
          index++;
        }
      }
    }

    return tokens;
  };

  const generateLineNumbers = (count: number): ReactElement[] => {
    return Array.from({ length: count }, (_, i) => (
      <div 
        key={i} 
        className={`line-number ${highlightedLines.includes(i + 1) ? 'highlighted' : ''}`}
      >
        {i + 1}
      </div>
    ));
  };

  const selectedCode = codeExamples[selectedLanguage] || '';
  const codeLines = selectedCode.split('\n');

  return (
    <div className={`code-section ${compactMode ? 'compact' : ''}`}>
      <div className="code-header">
        <h3 className="section-title">算法代码</h3>
        <select 
          className="language-selector" 
          value={selectedLanguage} 
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
        </select>
      </div>
      
      <div className="code-container">
        <div className="line-numbers">
          {generateLineNumbers(codeLines.length)}
        </div>
        <pre className="algorithm-code">
          {codeLines.map((line, index) => (
            <div 
              key={index} 
              className={`code-line ${highlightedLines.includes(index + 1) ? 'highlighted' : ''}`}
            >
              {tokenizeLine(line, selectedLanguage)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay; 