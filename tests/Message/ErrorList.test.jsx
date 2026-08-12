import { render } from '@testing-library/react';

import ErrorList from '../../components/Message/ErrorList';

describe('ErrorList', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorList />);
    expect(container).toBeInTheDocument();
  });
});
