import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ProblemDescription from './ProblemDescription';

jest.mock('../../i18n', () => ({
  useCustomTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'zh' },
  }),
}));

describe('ProblemDescription', () => {
  it('shows the statement, examples, constraints, and online link when opened', () => {
    render(<ProblemDescription />);

    fireEvent.click(screen.getByRole('button', { name: 'problem.open' }));

    expect(screen.getByRole('dialog', { name: 'problem.title' })).toBeInTheDocument();
    expect(screen.getByText('problem.statement')).toBeInTheDocument();
    expect(screen.getByText('problem.exampleOne')).toBeInTheDocument();
    expect(screen.getByText('problem.lengthConstraint')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'problem.openLeetCode' })).toHaveAttribute(
      'href',
      'https://leetcode.cn/problems/move-zeroes/'
    );
  });

  it('closes with the close button and Escape key', () => {
    render(<ProblemDescription />);
    fireEvent.click(screen.getByRole('button', { name: 'problem.open' }));
    fireEvent.click(screen.getByRole('button', { name: 'problem.close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'problem.open' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'problem.open' })).toHaveFocus();
  });
});
