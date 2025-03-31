import React, { ReactElement } from 'react';
import { ProgrammingLanguage } from './codeSnippets';

// 关键词集合
const KEYWORDS: Record<ProgrammingLanguage, string[]> = {
  javascript: ['function', 'let', 'const', 'var', 'for', 'if', 'else', 'return', 'true', 'false', 'null', 'undefined'],
  typescript: ['function', 'let', 'const', 'var', 'for', 'if', 'else', 'return', 'true', 'false', 'null', 'undefined', 'number', 'string', 'boolean', 'any', 'void'],
  python: ['def', 'for', 'in', 'if', 'else', 'elif', 'return', 'None', 'True', 'False', 'range', 'len'],
  java: ['public', 'private', 'protected', 'class', 'void', 'int', 'boolean', 'String', 'for', 'if', 'else', 'return', 'true', 'false', 'null'],
  cpp: ['void', 'int', 'bool', 'for', 'if', 'else', 'return', 'true', 'false', 'nullptr', 'vector', 'size'],
  go: ['func', 'for', 'if', 'else', 'return', 'nil', 'len', 'var', 'const', 'int', 'string', 'bool']
};

// 运算符
const OPERATORS = ['+', '-', '*', '/', '=', '!', '&', '|', '<', '>', ':', ';', ',', '.', '(', ')', '[', ']', '{', '}'];

/**
 * 语法高亮函数
 * @param code 代码行
 * @param language 编程语言
 * @returns 高亮后的JSX元素
 */
export const highlightSyntax = (code: string, language: ProgrammingLanguage): ReactElement => {
  // 数字正则
  const numberRegex = /\b\d+\b/g;
  
  // 字符串正则
  const stringRegex = /(['"`])(?:\\.|[^\\])*?\1/g;
  
  // 注释正则
  const commentRegex = language === 'python' 
    ? /#.*/g 
    : /\/\/.*|\/\*[\s\S]*?\*\//g;
  
  // 关键词正则
  const keywordRegex = new RegExp(`\\b(${KEYWORDS[language].join('|')})\\b`, 'g');
  
  // 替换注释
  const withComments = code.replace(commentRegex, match => 
    `<span class="comment">${match}</span>`
  );
  
  // 替换字符串
  const withStrings = withComments.replace(stringRegex, match => 
    `<span class="string">${match}</span>`
  );
  
  // 替换数字
  const withNumbers = withStrings.replace(numberRegex, match => 
    `<span class="number">${match}</span>`
  );
  
  // 替换关键词
  const withKeywords = withNumbers.replace(keywordRegex, match => 
    `<span class="keyword">${match}</span>`
  );
  
  // 替换运算符
  let result = withKeywords;
  OPERATORS.forEach(op => {
    // 避免替换已经在其他标签内的字符
    const escapedOp = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const opRegex = new RegExp(`(?<!<span class="[^"]+">(?:[^<]|<(?!/span>))*?)${escapedOp}(?![^<]*?</span>)`, 'g');
    result = result.replace(opRegex, match => 
      `<span class="operator">${match}</span>`
    );
  });
  
  // 返回dangerouslySetInnerHTML
  return (
    <span dangerouslySetInnerHTML={{ __html: result }} />
  );
}; 