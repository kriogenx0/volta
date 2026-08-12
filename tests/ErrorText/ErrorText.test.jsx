import { render } from '@testing-library/react';

import ErrorText from '../../components/ErrorText/ErrorText';

describe('ErrorText', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorText />);
    expect(container).toBeInTheDocument();
  });
});
