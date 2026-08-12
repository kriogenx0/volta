import { render } from '@testing-library/react';

import CloseButton from '../../components/CloseButton';

describe('CloseButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<CloseButton />);
    expect(container).toBeInTheDocument();
  });
});
