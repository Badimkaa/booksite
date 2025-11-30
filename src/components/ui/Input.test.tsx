
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('should render an input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});
