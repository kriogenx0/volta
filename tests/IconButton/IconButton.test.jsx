import { render, screen, fireEvent } from '@testing-library/react';

import IconButton from '../../components/IconButton/IconButton';

const StubIcon = () => <svg />;

describe('IconButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<IconButton icon={StubIcon} label="Close" />);
    expect(container).toBeInTheDocument();
  });

  it('is labelled for assistive tech and defaults to the ghost variant', () => {
    render(<IconButton icon={StubIcon} label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('volta-icon_button--ghost');
  });

  it('supports the danger variant and click handling', () => {
    const onClick = jest.fn();
    render(<IconButton icon={StubIcon} label="Delete" variant="danger" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('volta-icon_button--danger');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
