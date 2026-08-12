import { render } from '@testing-library/react';

import RadioGroup from '../../components/RadioGroup/RadioGroup';

describe('RadioGroup', () => {
  it('renders without crashing', () => {
    const { container } = render(<RadioGroup />);
    expect(container).toBeInTheDocument();
  });
});
