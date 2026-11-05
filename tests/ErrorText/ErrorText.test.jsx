import { render, screen } from '@testing-library/react';

import ErrorText from '../../components/ErrorText/ErrorText';
import { ErrorText as NamedErrorText } from '../../components/ErrorText';

describe('ErrorText', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorText />);
    expect(container).toBeInTheDocument();
  });

  it('shows the message', () => {
    render(<ErrorText message="Required" />);
    expect(screen.getByText('Required')).toHaveClass('volta-error_text');
  });

  it('renders the message as a paragraph', () => {
    render(<ErrorText message="Required" />);
    expect(screen.getByText('Required').tagName).toBe('P');
  });

  it('accepts markup as the message', () => {
    render(<ErrorText message={<>Use <strong>8 characters</strong></>} />);
    expect(screen.getByText('8 characters').tagName).toBe('STRONG');
    expect(screen.getByText('8 characters').closest('p')).toHaveClass('volta-error_text');
  });

  it('is exported by name and by default from the folder', () => {
    expect(NamedErrorText).toBe(ErrorText);
  });
});
