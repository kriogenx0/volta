import { render } from '@testing-library/react';

import CheckboxGroup from '../../components/CheckboxGroup/CheckboxGroup';

describe('CheckboxGroup', () => {
  it('renders without crashing', () => {
    const { container } = render(<CheckboxGroup />);
    expect(container).toBeInTheDocument();
  });
});
