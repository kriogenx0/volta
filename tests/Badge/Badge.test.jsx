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

  describe('icon badges', () => {
    it.each([
      ['check', 'checkmark.circle.fill'],
      ['bluecheck', 'checkmark.circle.fill'],
      ['x', 'xmark.circle.fill']
    ])('draws %s as the SVG %s, with its colour class and no inline colour', (variant, icon) => {
      const { container } = render(<Badge variant={variant} />);
      const el = container.querySelector('i');
      expect(el).toHaveClass('volta-badge', 'badge-medium', `badge-${variant}`, 'icon-svg');
      expect(el).toHaveAttribute('data-type', icon);
      expect(el.querySelector('svg')).toBeInTheDocument();
      expect(el).not.toHaveAttribute('style');
    });

    it('takes a size', () => {
      const { container } = render(<Badge variant="check" size="large" />);
      expect(container.querySelector('i')).toHaveClass('badge-large');
    });

    it('renders nothing for a variant it does not know', () => {
      const { container } = render(<Badge variant="nope" />);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
