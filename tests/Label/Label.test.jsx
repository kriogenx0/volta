import { render, screen } from '@testing-library/react';

import Label from '../../components/Label/Label';

describe('Label', () => {
  it('renders without crashing', () => {
    const { container } = render(<Label />);
    expect(container).toBeInTheDocument();
  });

  it('shows the caption above the control when given text and children', () => {
    const { container } = render(<Label text="Email"><input name="email" /></Label>);
    const [caption, control] = container.querySelectorAll('label > div');
    expect(caption).toHaveTextContent('Email');
    expect(control).toContainElement(screen.getByRole('textbox'));
  });

  it('labels the wrapped control for assistive tech and click-to-focus', () => {
    render(<Label text="Email"><input name="email" /></Label>);
    expect(screen.getByLabelText('Email')).toBe(screen.getByRole('textbox'));
  });

  it('renders only the children when there is no text', () => {
    render(<Label><span>Nickname</span><input /></Label>);
    expect(screen.getByText('Nickname')).toBeInTheDocument();
    expect(screen.getByLabelText('Nickname')).toBe(screen.getByRole('textbox'));
  });

  it('renders the text when there are no children', () => {
    render(<Label text="Notification settings" />);
    expect(screen.getByText('Notification settings')).toBeInTheDocument();
  });
});
