import { render } from '@testing-library/react';

import LoaderLinearProgress from '../../components/LoaderLinearProgress/LoaderLinearProgress';

describe('LoaderLinearProgress', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoaderLinearProgress />);
    expect(container).toBeInTheDocument();
  });

  it('is indeterminate by default', () => {
    const { container } = render(<LoaderLinearProgress />);
    const bar = container.querySelector('.volta-loader_linear_progress');
    expect(bar).toHaveClass('is-indeterminate');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('renders a determinate width when progress is provided', () => {
    const { container } = render(<LoaderLinearProgress progress={65} />);
    const bar = container.querySelector('.volta-loader_linear_progress');
    expect(bar).not.toHaveClass('is-indeterminate');
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(container.querySelector('.volta-loader_linear_progress-bar')).toHaveStyle({ width: '65%' });
  });

  it('clamps progress to the 0-100 range', () => {
    const { container } = render(<LoaderLinearProgress progress={150} />);
    expect(container.querySelector('.volta-loader_linear_progress-bar')).toHaveStyle({ width: '100%' });
  });
});
