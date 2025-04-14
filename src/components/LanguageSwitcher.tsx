import React from 'react';
import { useCustomTranslation } from '../i18n';
import { changeLanguage } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useCustomTranslation();
  const currentLanguage = i18n.language || 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value;
    changeLanguage(language);
  };

  return (
    <div className="language-switcher" style={{
      position: 'absolute',
      top: '25px',
      right: '70px',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <select
        id="language-select"
        value={currentLanguage.startsWith('zh') ? 'zh' : 'en'}
        onChange={handleLanguageChange}
        style={{
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: '#2c3e50',
          color: '#fff'
        }}
      >
        <option value="en">{t('language.en')}</option>
        <option value="zh">{t('language.zh')}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher; 