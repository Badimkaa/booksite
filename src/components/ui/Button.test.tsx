
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render a button', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should apply the correct variant class', () => {
    render(<Button variant="destructive">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('should apply the correct size class', () => {
    render(<Button size="sm">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('h-9');
  });

  it('should render as a child component', () => {
    render(
      <Button asChild>
        <a href="/">Click me</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /click me/i });
    expect(link).toBeInTheDocument();
  });
});
