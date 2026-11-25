import React from 'react';
import { render, screen } from '@testing-library/react';
import ArrayRenderer from './ArrayRenderer';

const layout = {
  elementWidth: 60,
  elementHeight: 48,
  spacing: 16,
  startX: 20,
  startY: 80,
};

describe('ArrayRenderer', () => {
  it('keeps one comparison focus and marks the previous non-zero prefix as visited', () => {
    const { container } = render(
      <svg>
        <ArrayRenderer
          array={[2, 0, 3]}
          layout={layout}
          slowPointer={1}
          fastPointer={2}
          action="compare"
        />
      </svg>
    );

    expect(container.querySelectorAll('[data-status="compare"]')).toHaveLength(1);
    expect(container.querySelector('[data-node-id="array-slot-0"]'))
      .toHaveAttribute('data-status', 'visited');
    expect(container.querySelector('[data-node-id="array-slot-2"]'))
      .toHaveAttribute('data-status', 'compare');
  });

  it('marks the completed result as done with a non-color check signal', () => {
    render(
      <svg>
        <ArrayRenderer
          array={[2, 3, 0]}
          layout={layout}
          slowPointer={2}
          fastPointer={2}
          action="complete"
        />
      </svg>
    );

    expect(screen.getAllByText('✓')).toHaveLength(3);
    expect(document.querySelectorAll('[data-status="done"]')).toHaveLength(3);
    expect(document.querySelector('[data-node-id="array-slot-1"] rect'))
      ?.toHaveAttribute('data-state-label', '3，整理完成');
  });
});
