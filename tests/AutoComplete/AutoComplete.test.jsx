import { render } from '@testing-library/react';

import AutoComplete from '../../components/AutoComplete';

describe('AutoComplete', () => {
  it('renders without crashing', () => {
    const { container } = render(<AutoComplete />);
    expect(container).toBeInTheDocument();
  });
});
