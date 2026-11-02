import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('keeps empty and out-of-range progress states finite and bounded', () => {
    const onSeek = jest.fn();
    const { rerender } = render(
      <ProgressBar currentStep={99} totalSteps={0} onSeek={onSeek} />
    );
    const slider = screen.getByRole('slider', { name: '演示步骤进度' });

    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '0');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('/ 0')).toBeInTheDocument();

    rerender(<ProgressBar currentStep={99} totalSteps={3} onSeek={onSeek} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '2');
    expect(document.querySelector('.progress-played')).toHaveStyle({ width: '100%' });
  });

  it('exposes slider semantics and supports keyboard seeking', () => {
    const onSeek = jest.fn();
    render(<ProgressBar currentStep={3} totalSteps={8} onSeek={onSeek} />);
    const slider = screen.getByRole('slider', { name: '演示步骤进度' });

    expect(slider).toHaveAttribute('aria-valuenow', '3');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onSeek).toHaveBeenLastCalledWith(4);
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onSeek).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onSeek).toHaveBeenLastCalledWith(7);
  });

  it('handles pointer dragging and releases pointer capture', () => {
    const onSeek = jest.fn();
    render(<ProgressBar currentStep={0} totalSteps={5} onSeek={onSeek} />);
    const slider = screen.getByRole('slider', { name: '演示步骤进度' });
    const rect = { left: 10, width: 100, top: 0, right: 110, bottom: 8, height: 8, x: 10, y: 0, toJSON: () => ({}) };
    slider.getBoundingClientRect = () => rect as DOMRect;
    slider.setPointerCapture = jest.fn();
    slider.hasPointerCapture = jest.fn(() => true);
    slider.releasePointerCapture = jest.fn();

    const dispatchPointerEvent = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, clientX });
      Object.defineProperties(event, {
        pointerId: { value: 1 },
        pointerType: { value: 'touch' },
      });
      slider.dispatchEvent(event);
    };

    act(() => dispatchPointerEvent('pointerdown', 10));
    expect(onSeek).toHaveBeenLastCalledWith(0);
    act(() => dispatchPointerEvent('pointermove', 110));
    expect(onSeek).toHaveBeenLastCalledWith(4);
    act(() => dispatchPointerEvent('pointerup', 110));

    expect(slider.setPointerCapture).toHaveBeenCalledWith(1);
    expect(slider.releasePointerCapture).toHaveBeenCalledWith(1);
  });
});
