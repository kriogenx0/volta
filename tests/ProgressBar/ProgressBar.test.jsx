import { render } from '@testing-library/react';

import ProgressBar, { LoaderLinearProgress } from '../../components/ProgressBar/ProgressBar';
import * as library from '../../components';

const bar = (container) => container.querySelector('.volta-progress_bar');
const fill = (container) => container.querySelector('.volta-progress_bar .percent');

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProgressBar />);
    expect(container).toBeInTheDocument();
  });

  it('is a progressbar with a 0-100 range', () => {
    const { getByRole } = render(<ProgressBar percent={30} />);
    const progress = getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '30');
  });

  describe('determinate', () => {
    it('fills to the percent', () => {
      const { container } = render(<ProgressBar percent={50} />);
      expect(bar(container)).not.toHaveClass('progress_bar-indeterminate');
      expect(fill(container)).toHaveStyle({ width: '50%' });
    });

    it('treats 0 as a known, empty value', () => {
      const { container, getByRole } = render(<ProgressBar percent={0} />);
      expect(bar(container)).not.toHaveClass('progress_bar-indeterminate');
      expect(fill(container)).toHaveStyle({ width: '0%' });
      expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });

    it('clamps the percent to 0-100', () => {
      const over = render(<ProgressBar percent={150} />);
      expect(fill(over.container)).toHaveStyle({ width: '100%' });
      const under = render(<ProgressBar percent={-20} />);
      expect(fill(under.container)).toHaveStyle({ width: '0%' });
    });

    it('accepts a numeric string', () => {
      const { container } = render(<ProgressBar percent='40' />);
      expect(bar(container)).not.toHaveClass('progress_bar-indeterminate');
      expect(fill(container)).toHaveStyle({ width: '40%' });
    });
  });

  describe('indeterminate', () => {
    it('is inferred when there is no percent', () => {
      const { container, getByRole } = render(<ProgressBar />);
      expect(bar(container)).toHaveClass('progress_bar-indeterminate');
      expect(getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });

    it.each([['text', 'abc'], ['an empty string', ''], ['null', null], ['NaN', NaN]])(
      'is inferred when the percent is %s',
      (_label, percent) => {
        const { container } = render(<ProgressBar percent={percent} />);
        expect(bar(container)).toHaveClass('progress_bar-indeterminate');
      }
    );

    it('is set by the indeterminate prop', () => {
      const { container, getByRole } = render(<ProgressBar indeterminate />);
      expect(bar(container)).toHaveClass('progress_bar-indeterminate');
      expect(getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });

    it('wins over a percent', () => {
      const { container } = render(<ProgressBar indeterminate percent={50} />);
      expect(bar(container)).toHaveClass('progress_bar-indeterminate');
      expect(fill(container)).not.toHaveAttribute('style');
    });

    it('can be turned off, leaving an empty bar when there is no percent', () => {
      const { container, getByRole } = render(<ProgressBar indeterminate={false} />);
      expect(bar(container)).not.toHaveClass('progress_bar-indeterminate');
      expect(fill(container)).toHaveStyle({ width: '0%' });
      expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });

    it('uses the bouncing variant by default and accepts flowing', () => {
      const bouncing = render(<ProgressBar indeterminate />);
      expect(bar(bouncing.container)).toHaveClass('progress_bar-bouncing');
      const flowing = render(<ProgressBar indeterminate variant='flowing' />);
      expect(bar(flowing.container)).toHaveClass('progress_bar-flowing');
    });
  });

  describe('fixed', () => {
    it('is inline by default', () => {
      const { container } = render(<ProgressBar percent={10} />);
      expect(bar(container)).not.toHaveClass('progress_bar-fixed');
    });

    it('pins to the window when fixed', () => {
      const { container } = render(<ProgressBar fixed percent={10} />);
      expect(bar(container)).toHaveClass('progress_bar-fixed');
    });
  });
});

describe('LoaderLinearProgress', () => {
  it('is exported from the library as well as from ProgressBar', () => {
    expect(library.LoaderLinearProgress).toBe(LoaderLinearProgress);
  });

  it('is a fixed, indeterminate bar by default', () => {
    const { container, getByRole } = render(<LoaderLinearProgress />);
    expect(bar(container)).toHaveClass('progress_bar-fixed', 'progress_bar-indeterminate', 'progress_bar-flowing');
    expect(getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('renders a determinate width from progress', () => {
    const { container, getByRole } = render(<LoaderLinearProgress progress={65} />);
    expect(bar(container)).not.toHaveClass('progress_bar-indeterminate');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '65');
    expect(fill(container)).toHaveStyle({ width: '65%' });
  });

  it('clamps progress to the 0-100 range', () => {
    const { container } = render(<LoaderLinearProgress progress={150} />);
    expect(fill(container)).toHaveStyle({ width: '100%' });
  });
});
