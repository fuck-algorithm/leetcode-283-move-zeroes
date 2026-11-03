import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/canvas/D3Canvas', () => () => <div data-testid="algorithm-canvas">画布</div>);

jest.mock('./i18n', () => {
  const React = require('react');
  let language = 'zh';
  const listeners: Array<() => void> = [];
  return {
    __esModule: true,
    default: { language: 'zh' },
    useCustomTranslation: () => {
      const [, rerender] = React.useReducer((value: number) => value + 1, 0);
      React.useEffect(() => {
        listeners.push(rerender);
        return () => {
          const index = listeners.indexOf(rerender);
          if (index >= 0) listeners.splice(index, 1);
        };
      }, []);
      return {
        t: (key: string) => {
          const translations: Record<string, { zh: string; en: string }> = {
            'language.change': { zh: '切换语言', en: 'Change Language' },
            'problem.open': { zh: '题目描述', en: 'Problem' },
          };
          return translations[key]?.[language as 'zh' | 'en'] ?? key;
        },
        i18n: { language },
      };
    },
    changeLanguage: (nextLanguage: string) => {
      language = nextLanguage;
      listeners.forEach((listener) => listener());
    },
  };
});

jest.mock('./hooks/useIndexedDB', () => ({
  useLanguagePreference: () => ({ language: 'javascript', setLanguage: jest.fn() }),
  usePlaybackSpeed: () => ({ speed: 1, setSpeed: jest.fn() }),
  useGitHubStars: () => ({ starCount: 0, isLoading: false }),
}));

test('renders the Move Zeroes visualization and its main controls', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: '283. 移动零' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /最多 20 个整数/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /下一步/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '题目描述' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '思路说明' })).toBeInTheDocument();
});

test('global language selector updates the active language', () => {
  render(<App />);
  const select = screen.getByRole('combobox', { name: '切换语言' });
  fireEvent.change(select, { target: { value: 'en' } });
  expect(screen.getByRole('heading', { name: '283. Move Zeroes' })).toBeInTheDocument();
});
