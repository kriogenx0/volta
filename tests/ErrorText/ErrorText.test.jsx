import { render, screen } from '@testing-library/react';

import ErrorText from '../../components/ErrorText/ErrorText';

describe('ErrorText', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorText />);
    expect(container).toBeInTheDocument();
  });

  it('shows the message', () => {
    render(<ErrorText message="Required" />);
    expect(screen.getByText('Required')).toHaveClass('volta-error_text');
  });
});
