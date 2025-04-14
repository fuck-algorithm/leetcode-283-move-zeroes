import React from 'react';
import { useCustomTranslation } from '../i18n';

const BackToList: React.FC = () => {
  const { t } = useCustomTranslation();
  
  return (
    <div className="back-to-list" style={{
      position: 'absolute',
      top: '25px',
      left: '20px',
      zIndex: 1000
    }}>
      <a 
        href="https://fuck-algorithm.github.io/leetcode-hot-100/" 
        target="_blank" 
        rel="noopener noreferrer"
        title={t('app.backToList')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          backgroundColor: '#3a3f4b',
          borderRadius: '4px',
          padding: '5px 10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          color: '#ffffff',
          fontSize: '14px'
        }}
      >
        <svg height="16" width="16" style={{ marginRight: '5px' }} viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"></path>
        </svg>
        {t('app.backToList')}
      </a>
    </div>
  );
};

export default BackToList; 