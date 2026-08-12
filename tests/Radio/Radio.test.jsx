import { render } from '@testing-library/react';

import Radio from '../../components/Radio/Radio';

describe('Radio', () => {
  it('renders without crashing', () => {
    const { container } = render(<Radio />);
    expect(container).toBeInTheDocument();
  });
});
