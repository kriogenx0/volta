import { render } from '@testing-library/react';

import Layer from '../../components/Layer/Layer';

describe('Layer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Layer />);
    expect(container).toBeInTheDocument();
  });
});
