/**
 * 代码展示组件
 * 显示多语言代码，支持语法高亮、行号、当前行高亮和变量值显示
 * Requirements: 5.1, 5.5, 5.6, 5.7, 5.8, 5.9
 */

import React, { useMemo } from 'react';
import { CodeDisplayProps, SupportedLanguage, AlgorithmStep } from '../../types';
import { getCodeSnippet, getCodeLines2Array } from '../../utils/codeLineMapper';
import { CODE_HIGHLIGHT_COLORS } from '../../utils/colorScheme';
import LanguageSelector from './LanguageSelector';
import './CodeDisplay.css';

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  language,
  currentStep,
  onLanguageChange,
}) => {
  // 获取当前语言的代码行
  const codeLines = useMemo(() => {
    return getCodeLines2Array(language);
  }, [language]);

  // 获取当前步骤高亮的行号
  const highlightedLines = useMemo(() => {
    if (!currentStep) return new Set<number>();
    return new Set(currentStep.codeLines[language]);
  }, [currentStep, language]);

  // 格式化变量值显示
  const formatVariableValue = (name: string, value: number | number[]): string => {
    if (Array.isArray(value)) {
      return `${name} = [${value.join(', ')}]`;
    }
    return `${name} = ${value}`;
  };

  // 获取某行需要显示的变量
  const getLineVariables = (lineNumber: number): string | null => {
    if (!currentStep || !highlightedLines.has(lineNumber)) return null;
    
    const { variables } = currentStep;
    const varStrings: string[] = [];

    // 根据行号和操作类型决定显示哪些变量
    if (currentStep.action === 'init' || currentStep.action === 'move_slow') {
      varStrings.push(formatVariableValue('slow', variables.slow));
    }
    if (currentStep.action === 'compare' || currentStep.action === 'move_fast') {
      varStrings.push(formatVariableValue('fast', variables.fast));
    }
    if (currentStep.action === 'swap') {
      varStrings.push(formatVariableValue('slow', variables.slow));
      varStrings.push(formatVariableValue('fast', variables.fast));
    }

    return varStrings.length > 0 ? varStrings.join(', ') : null;
  };

  // 语法高亮 - 使用 React 元素而非 dangerouslySetInnerHTML
  const highlightSyntax = (code: string, lang: SupportedLanguage): React.ReactNode => {
    // 关键字定义
    const keywords: Record<SupportedLanguage, string[]> = {
      java: ['public', 'void', 'int', 'for', 'if', 'else', 'return', 'new', 'class', 'static', 'private', 'protected'],
      python: ['def', 'for', 'in', 'if', 'else', 'elif', 'return', 'range', 'len', 'None', 'True', 'False', 'import', 'from', 'class', 'self'],
      golang: ['func', 'for', 'if', 'else', 'var', 'return', 'package', 'import', 'type', 'struct', 'range', 'len', 'make', 'nil'],
      javascript: ['function', 'let', 'const', 'var', 'for', 'if', 'else', 'return', 'new', 'class', 'this', 'async', 'await'],
    };

    // 构建正则表达式
    const keywordPattern = keywords[lang].join('|');
    const tokenRegex = new RegExp(
      `(\\b(?:${keywordPattern})\\b)|(\\b\\d+\\b)|(["'][^"']*["'])|(\\S+)|(\\s+)`,
      'g'
    );

    const tokens: React.ReactNode[] = [];
    let match;
    let key = 0;

    while ((match = tokenRegex.exec(code)) !== null) {
      const [fullMatch, keyword, number, string, other, whitespace] = match;
      
      if (keyword) {
        tokens.push(<span key={key++} className="syntax-keyword">{keyword}</span>);
      } else if (number) {
        tokens.push(<span key={key++} className="syntax-number">{number}</span>);
      } else if (string) {
        tokens.push(<span key={key++} className="syntax-string">{string}</span>);
      } else if (whitespace) {
        tokens.push(<span key={key++}>{whitespace}</span>);
      } else if (other) {
        // 检查是否是函数名（后面跟着括号）
        if (other.match(/^[a-zA-Z_]\w*$/) && code.slice(match.index + other.length).match(/^\s*\(/)) {
          tokens.push(<span key={key++} className="syntax-function">{other}</span>);
        } else {
          tokens.push(<span key={key++}>{other}</span>);
        }
      }
    }

    return <>{tokens}</>;
  };

  return (
    <div className="code-display">
      <div className="code-header">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
        />
      </div>
      
      <div className="code-container">
        <pre className="code-pre">
          {codeLines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightedLines.has(lineNumber);
            const variables = getLineVariables(lineNumber);

            return (
              <div
                key={lineNumber}
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                style={isHighlighted ? { backgroundColor: CODE_HIGHLIGHT_COLORS.currentLine } : {}}
              >
                <span className="line-number">{lineNumber}</span>
                <span className="line-content">
                  {highlightSyntax(line, language)}
                </span>
                {variables && (
                  <span className="line-variables">{variables}</span>
                )}
              </div>
            );
          })}
        </pre>
      </div>

      {currentStep && (
        <div className="step-description">
          <span className="step-label">步骤 {currentStep.id + 1}:</span>
          <span className="step-text">{currentStep.description}</span>
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
