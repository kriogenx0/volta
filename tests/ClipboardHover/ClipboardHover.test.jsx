import { render, screen } from '@testing-library/react';

import ClipboardHover from '../../components/ClipboardHover/ClipboardHover';

describe('ClipboardHover', () => {
  it('renders without crashing', () => {
    const { container } = render(<ClipboardHover />);
    expect(container).toBeInTheDocument();
  });
});

describe('ClipboardHover copy button name', () => {
  it('is named, since it holds only an icon, and the icon is hidden from assistive technology', () => {
    const { container } = render(<ClipboardHover>token</ClipboardHover>);
    const button = screen.getByRole('button', { name: 'Copy to clipboard', hidden: true });
    expect(button).toHaveAttribute('title', 'Copy to clipboard');
    expect(container.querySelector('.volta-icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
