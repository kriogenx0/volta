import { render } from '@testing-library/react';

import SearchSelector from '../../components/SearchSelector/SearchSelector';

describe('SearchSelector', () => {
  it('renders without crashing', () => {
    const { container } = render(<SearchSelector />);
    expect(container).toBeInTheDocument();
  });
});
