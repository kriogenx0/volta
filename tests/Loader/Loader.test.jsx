import { render } from '@testing-library/react';

import Loader from '../../components/Loader/Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });
});
