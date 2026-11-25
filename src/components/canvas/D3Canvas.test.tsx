import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import D3Canvas from './D3Canvas';
import { generateSteps } from '../../utils/stepGenerator';

jest.mock('d3', () => {
  const chain: any = {
    scaleExtent: () => chain,
    on: () => chain,
    call: () => chain,
    interrupt: () => chain,
    transition: () => chain,
    duration: () => chain,
  };
  return {
    select: () => chain,
    zoom: () => chain,
    zoomIdentity: {
      translate: () => ({ scale: () => ({ translate: () => ({ x: 0, y: 0, k: 1 }) }) }),
    },
  };
});

const steps = generateSteps([0, 1, 0, 3, 12]);
const step = steps[0];

const createMatchMedia = (matches: boolean) => (query: string) => ({
  matches,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('D3Canvas teaching layer', () => {
  beforeEach(() => {
    window.matchMedia = createMatchMedia(true) as typeof window.matchMedia;
  });

  it('keeps operation, narration, legend, and metrics visible in reduced-motion mode', () => {
    render(<D3Canvas step={step} width={800} height={480} />);

    expect(screen.getByTestId('operation-badge')).toHaveAttribute('data-operation', 'init');
    expect(screen.getByTestId('step-narration')).toHaveTextContent(step.narration);
    expect(screen.getByLabelText('画布图例')).toBeInTheDocument();
    expect(screen.getByLabelText('算法指标')).toBeInTheDocument();
    expect(document.querySelector('.d3-canvas-container'))
      ?.toHaveStyle({ '--motion-state-duration': '240ms' });
  });

  it('updates teaching metadata when the snapshot changes', async () => {
    const { rerender } = render(<D3Canvas step={step} width={800} height={480} />);
    const nextStep = steps.find(candidate => candidate.action === 'compare');
    expect(nextStep).toBeDefined();

    rerender(<D3Canvas step={nextStep || step} width={800} height={480} />);
    await waitFor(() => expect(screen.getByTestId('operation-badge'))
      .toHaveAttribute('data-operation', 'compare'));
    expect(screen.getByTestId('step-narration')).toHaveTextContent(nextStep?.narration || '');
  });

  it('renders the stable canvas layer for camera interactions', () => {
    render(<D3Canvas step={step} width={800} height={480} />);
    expect(document.querySelector('svg.d3-canvas')).toBeInTheDocument();
    expect(document.querySelector('.canvas-content')).toBeInTheDocument();
  });
});
