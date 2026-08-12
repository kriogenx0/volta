import { render } from '@testing-library/react';

import IndicatorDot from '../../components/IndicatorDot/IndicatorDot';

describe('IndicatorDot', () => {
  it('renders without crashing', () => {
    const { container } = render(<IndicatorDot />);
    expect(container).toBeInTheDocument();
  });
});
