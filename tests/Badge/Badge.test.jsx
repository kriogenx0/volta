import { render, screen } from '@testing-library/react';

import Badge from '../../components/Badge/Badge';

describe('Badge', () => {
  it('renders without crashing', () => {
    const { container } = render(<Badge />);
    expect(container).toBeInTheDocument();
  });

  it('renders a text badge in the given tone', () => {
    render(<Badge tone="success">Paid</Badge>);
    expect(screen.getByText('Paid')).toHaveClass('volta-badge', 'volta-badge--pill', 'volta-badge--success');
  });

  it('defaults a text badge to the neutral tone', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).toHaveClass('volta-badge--neutral');
  });

  it('lists the available tones', () => {
    expect(Badge.tones).toEqual(['success', 'warning', 'danger', 'neutral', 'info']);
  });
});
