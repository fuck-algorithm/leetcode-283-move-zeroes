import React from 'react';
import { changeLanguage, useCustomTranslation } from '../i18n';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useCustomTranslation();
  const currentLanguage = i18n.language || 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value;
    changeLanguage(language);
  };

  return (
    <label className="language-switcher" htmlFor="language-select">
      <span className="language-switcher-label">{t('language.change')}</span>
      <select
        id="language-select"
        aria-label={t('language.change')}
        value={currentLanguage.startsWith('zh') ? 'zh' : 'en'}
        onChange={handleLanguageChange}
      >
        <option value="en">{t('language.en')}</option>
        <option value="zh">{t('language.zh')}</option>
      </select>
    </label>
  );
};

export default LanguageSwitcher; 