/**
 * 语言选择器组件
 * 支持 Java、Python、Golang、JavaScript 四种语言切换
 * Requirements: 5.2, 5.3, 5.4
 */

import React from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../../types';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="language-selector">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          className={`language-btn ${currentLanguage === lang ? 'active' : ''}`}
          onClick={() => onLanguageChange(lang)}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
