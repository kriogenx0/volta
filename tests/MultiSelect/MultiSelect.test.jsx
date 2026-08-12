import { render } from '@testing-library/react';

import MultiSelect from '../../components/MultiSelect/MultiSelect';

describe('MultiSelect', () => {
  it('renders without crashing', () => {
    const { container } = render(<MultiSelect />);
    expect(container).toBeInTheDocument();
  });
});
