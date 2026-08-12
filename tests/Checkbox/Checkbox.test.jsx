import { render } from '@testing-library/react';

import Checkbox from '../../components/Checkbox/Checkbox';

describe('Checkbox', () => {
  it('renders without crashing', () => {
    const { container } = render(<Checkbox />);
    expect(container).toBeInTheDocument();
  });
});
