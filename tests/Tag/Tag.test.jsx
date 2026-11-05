import { render, screen, fireEvent } from '@testing-library/react';

import Tag from '../../components/Tag/Tag';

describe('Tag', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tag />);
    expect(container).toBeInTheDocument();
  });

  it('renders its children in a volta-tag', () => {
    render(<Tag>Design</Tag>);
    expect(screen.getByText('Design')).toHaveClass('volta-tag');
  });

  it('does not show the delete icon or the deletable/clickable classes by default', () => {
    const { container } = render(<Tag>Design</Tag>);
    const tag = container.firstChild;
    expect(tag).not.toHaveClass('deletable');
    expect(tag).not.toHaveClass('clickable');
    expect(container.querySelector('.volta-icon')).toBeNull();
  });

  // Regression: Tag used <Icon> without importing it, so any deletable tag threw
  // "ReferenceError: Icon is not defined".
  it('renders the delete icon for a deletable tag', () => {
    const { container } = render(<Tag deletable>React</Tag>);
    expect(container.firstChild).toHaveClass('deletable');
    const icon = container.querySelector('.volta-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-type', 'xmark');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onClick and is operable like a button when clickable', () => {
    const onClick = jest.fn();
    render(<Tag onClick={onClick}>Engineering</Tag>);
    const tag = screen.getByRole('button', { name: 'Engineering' });
    expect(tag).toHaveClass('clickable');
    expect(tag).toHaveAttribute('tabindex', '0');

    fireEvent.click(tag);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates a clickable tag with Enter and Space', () => {
    const onClick = jest.fn();
    render(<Tag onClick={onClick}>Engineering</Tag>);
    const tag = screen.getByRole('button', { name: 'Engineering' });

    fireEvent.keyDown(tag, { key: 'Enter' });
    fireEvent.keyDown(tag, { key: ' ' });
    fireEvent.keyDown(tag, { key: 'a' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('is not a button when it has no onClick', () => {
    render(<Tag>Plain</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
