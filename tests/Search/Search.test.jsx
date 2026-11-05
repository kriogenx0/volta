import { jsx } from 'react/jsx-runtime';
import { render, screen } from '@testing-library/react';

import SearchStore from '../../components/Search/SearchStore';
import SelectInput from '../../components/Search/SelectInput';

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('Search components with the automatic JSX runtime', () => {
  it('SearchStore defaults to no stores', () => {
    render(jsx(SearchStore, {}));
    expect(screen.getByText('No matches.')).toBeInTheDocument();
  });

  it('SelectInput renders only the select by default', () => {
    const { container } = render(jsx(SelectInput, {}));
    expect(container.querySelector('select')).toBeInTheDocument();
    expect(container.querySelectorAll('option')).toHaveLength(0);
  });
});
