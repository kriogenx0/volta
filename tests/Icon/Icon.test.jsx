import { render } from '@testing-library/react';

import Icon from '../../components/Icon/Icon';

describe('Icon', () => {
  it('renders without crashing', () => {
    const { container } = render(<Icon />);
    expect(container).toBeInTheDocument();
  });
});
