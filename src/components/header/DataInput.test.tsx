import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DataInput from './DataInput';

describe('DataInput', () => {
  it('shows a live element count and applies valid input', () => {
    const onArrayChange = jest.fn();
    render(<DataInput initialArray={[0, 1]} onArrayChange={onArrayChange} />);

    const input = screen.getByRole('textbox', { name: /最多 20 个整数/ });
    expect(screen.getByText('2/20')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '1, 0, -3' } });
    expect(screen.getByText('3/20')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onArrayChange).toHaveBeenCalledWith([1, 0, -3]);
  });

  it.each([
    ['[0, 1, 2]', '3/20'],
    ['1，2，3', '3/20'],
    ['1  2 3', '3/20'],
    [' [ -1, 0 ] ', '2/20'],
  ])('counts entered values in %j correctly', (value, expectedCount) => {
    render(<DataInput initialArray={[0]} onArrayChange={jest.fn()} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value } });
    expect(screen.getByText(expectedCount)).toBeInTheDocument();
  });

  it('rejects too-long input without changing the visualization', () => {
    const onArrayChange = jest.fn();
    render(<DataInput initialArray={[0, 1]} onArrayChange={onArrayChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: Array.from({ length: 21 }, () => '1').join(',') } });
    fireEvent.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.getByRole('alert')).toHaveTextContent('数组长度不能超过20');
    expect(onArrayChange).not.toHaveBeenCalled();
  });

  it('rejects malformed input without changing the visualization', () => {
    const onArrayChange = jest.fn();
    render(<DataInput initialArray={[0, 1]} onArrayChange={onArrayChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1,,2' } });
    fireEvent.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onArrayChange).not.toHaveBeenCalled();
  });
});
