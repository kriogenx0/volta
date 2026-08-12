import { render } from '@testing-library/react';

import NavBar from '../../components/NavBar/NavBar';

describe('NavBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<NavBar />);
    expect(container).toBeInTheDocument();
  });
});
