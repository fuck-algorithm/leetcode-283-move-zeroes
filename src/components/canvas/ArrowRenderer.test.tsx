import React from 'react';
import { render, screen } from '@testing-library/react';
import ArrowRenderer from './ArrowRenderer';

const layout = {
  arrayLength: 5,
  elementWidth: 60,
  elementHeight: 48,
  spacing: 16,
  totalWidth: 5 * 60 + 4 * 16,
  startX: 100,
  startY: 200,
};

describe('ArrowRenderer', () => {
  it('renders explanatory badges on both directed swap arrows', () => {
    render(
      <svg>
        <ArrowRenderer
          fromIndex={1}
          toIndex={2}
          layout={layout}
          forwardLabel="把 7 放到 slow 空格"
          reverseLabel="把 0 移到 fast 格"
        />
      </svg>
    );

    expect(screen.getByTestId('arrow-explanation-forward')).toHaveTextContent('把 7 放到 slow 空格');
    expect(screen.getByTestId('arrow-explanation-reverse')).toHaveTextContent('把 0 移到 fast 格');
    expect(screen.getByTestId('arrow-explanation-forward')).toHaveAttribute('aria-label', '把 7 放到 slow 空格');
    expect(screen.getByTestId('arrow-explanation-reverse')).toHaveAttribute('aria-label', '把 0 移到 fast 格');
  });

  it('keeps badges within the array layout for short and long explanations', () => {
    render(
      <svg>
        <ArrowRenderer
          fromIndex={0}
          toIndex={4}
          layout={layout}
          forwardLabel="fast 12 → slow 空位"
          reverseLabel="slow 空格 → fast"
        />
      </svg>
    );

    const forward = screen.getByTestId('arrow-explanation-forward').querySelector('rect');
    const reverse = screen.getByTestId('arrow-explanation-reverse').querySelector('rect');
    expect(Number(forward?.getAttribute('width'))).toBeLessThanOrEqual(240);
    expect(Number(reverse?.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(forward?.getAttribute('y'))).toBeLessThan(layout.startY - 50);
    expect(Number(reverse?.getAttribute('y'))).toBeGreaterThan(layout.startY + layout.elementHeight);
  });
});
