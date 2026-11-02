import React, { useEffect, useRef } from 'react';
import { useCustomTranslation } from '../../i18n';
import './ProblemDescription.css';

const ProblemDescription: React.FC = () => {
  const { t } = useCustomTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
      return;
    }

    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        className="problem-description-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {t('problem.open')}
      </button>
      {isOpen && (
        <div
          className="problem-description-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            aria-labelledby="problem-description-title"
            aria-modal="true"
            className="problem-description-dialog"
            role="dialog"
          >
            <header className="problem-description-header">
              <div>
                <span className="problem-description-number">LeetCode 283</span>
                <h2 id="problem-description-title">{t('problem.title')}</h2>
              </div>
              <button
                aria-label={t('problem.close')}
                className="problem-description-close"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </header>
            <div className="problem-description-content">
              <p className="problem-description-statement">{t('problem.statement')}</p>
              <section>
                <h3>{t('problem.exampleOneTitle')}</h3>
                <pre>{t('problem.exampleOne')}</pre>
              </section>
              <section>
                <h3>{t('problem.exampleTwoTitle')}</h3>
                <pre>{t('problem.exampleTwo')}</pre>
              </section>
              <section>
                <h3>{t('problem.constraintsTitle')}</h3>
                <ul>
                  <li>{t('problem.lengthConstraint')}</li>
                  <li>{t('problem.valueConstraint')}</li>
                </ul>
              </section>
              <a
                className="problem-description-link"
                href="https://leetcode.cn/problems/move-zeroes/"
                rel="noreferrer"
                target="_blank"
              >
                {t('problem.openLeetCode')}
              </a>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProblemDescription;
