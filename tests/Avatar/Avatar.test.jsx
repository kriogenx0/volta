import { render } from '@testing-library/react';

import Avatar from '../../components/Avatar/Avatar';

describe('Avatar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    expect(container).toBeInTheDocument();
  });
});
