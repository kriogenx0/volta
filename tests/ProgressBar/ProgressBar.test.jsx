import { render } from '@testing-library/react';

import ProgressBar from '../../components/ProgressBar/ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProgressBar />);
    expect(container).toBeInTheDocument();
  });
});
