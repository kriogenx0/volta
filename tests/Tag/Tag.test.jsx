import { render } from '@testing-library/react';

import Tag from '../../components/Tag/Tag';

describe('Tag', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tag />);
    expect(container).toBeInTheDocument();
  });
});
