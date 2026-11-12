import { render } from '@testing-library/react';

import Definitions from '../../components/Definitions/Definitions';

describe('Definitions', () => {
  it('renders without crashing', () => {
    const { container } = render(<Definitions />);
    expect(container).toBeInTheDocument();
  });
});
