import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useKeyboardControls } from './useKeyboardControls';

const KeyboardHarness: React.FC<{
  onStepForward: jest.Mock;
  onStepBackward: jest.Mock;
  onTogglePlay: jest.Mock;
  onReset: jest.Mock;
}> = (props) => {
  useKeyboardControls(props);
  return (
    <>
      <button type="button">Play</button>
      <input aria-label="Array input" />
      <div data-testid="canvas" tabIndex={0}>Canvas</div>
      <div aria-valuemax={9} aria-valuemin={0} aria-valuenow={0} role="slider" tabIndex={0}>Progress</div>
    </>
  );
};

describe('useKeyboardControls', () => {
  it('ignores shortcuts originating from controls and editable fields', () => {
    const handlers = {
      onStepForward: jest.fn(),
      onStepBackward: jest.fn(),
      onTogglePlay: jest.fn(),
      onReset: jest.fn(),
    };
    render(<KeyboardHarness {...handlers} />);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Play' }), { key: ' ' });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Array input' }), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });

    expect(handlers.onTogglePlay).not.toHaveBeenCalled();
    expect(handlers.onStepForward).not.toHaveBeenCalled();
  });

  it('handles shortcuts from the visualization without duplicating native control actions', () => {
    const handlers = {
      onStepForward: jest.fn(),
      onStepBackward: jest.fn(),
      onTogglePlay: jest.fn(),
      onReset: jest.fn(),
    };
    render(<KeyboardHarness {...handlers} />);
    const canvas = screen.getByTestId('canvas');

    fireEvent.keyDown(canvas, { key: 'ArrowRight' });
    fireEvent.keyDown(canvas, { key: 'ArrowLeft' });
    fireEvent.keyDown(canvas, { key: ' ' });
    fireEvent.keyDown(canvas, { key: 'r' });

    expect(handlers.onStepForward).toHaveBeenCalledTimes(1);
    expect(handlers.onStepBackward).toHaveBeenCalledTimes(1);
    expect(handlers.onTogglePlay).toHaveBeenCalledTimes(1);
    expect(handlers.onReset).toHaveBeenCalledTimes(1);
  });
});
