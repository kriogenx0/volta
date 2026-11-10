import { render } from '@testing-library/react';

import IndicatorDot from '../../components/IndicatorDot/IndicatorDot';

describe('IndicatorDot', () => {
  it('renders without crashing', () => {
    const { container } = render(<IndicatorDot />);
    expect(container).toBeInTheDocument();
  });
});

describe('IndicatorDot drawing', () => {
  it('draws a solid dot as SVG, so it shows without an icon font', () => {
    const { container } = render(<IndicatorDot />);
    const icon = container.querySelector('i.volta-icon');
    expect(icon).toHaveAttribute('data-type', 'circle.fill');
    expect(icon).toHaveClass('icon-svg');
    const path = icon.querySelector('svg path');
    expect(path).toHaveAttribute('fill', 'currentColor');
  });

  it('takes its colour from the variant class, and its size from the size class', () => {
    const { container } = render(<IndicatorDot variant="complete" size="small" className="extra" />);
    expect(container.firstChild).toHaveClass('volta-indicator_dot', 'indicator_dot-complete', 'indicator_dot-small', 'extra');
  });

  it('passes other attributes to the wrapper', () => {
    const { container } = render(<IndicatorDot title="Done" />);
    expect(container.firstChild).toHaveAttribute('title', 'Done');
  });
});
