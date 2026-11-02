import React, { useEffect, useRef } from 'react';
import { useCustomTranslation } from '../../i18n';
import './ProblemDescription.css';

const ProblemDescription: React.FC = () => {
  const { t } = useCustomTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousBodyOverflow = useRef('');

  useEffect(() => {
    if (!isOpen) return;

    previousBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow.current;
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
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
            if (event.target === event.currentTarget) {
              setIsOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <section
            ref={dialogRef}
            aria-labelledby="problem-description-title"
            aria-modal="true"
            className="problem-description-dialog"
            role="dialog"
            tabIndex={-1}
          >
            <header className="problem-description-header">
              <div>
                <span className="problem-description-number">LeetCode 283</span>
                <h2 id="problem-description-title">{t('problem.title')}</h2>
              </div>
              <button
                ref={closeRef}
                aria-label={t('problem.close')}
                className="problem-description-close"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
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
