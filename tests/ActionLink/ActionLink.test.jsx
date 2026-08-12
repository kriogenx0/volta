import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ActionLink from '../../components/ActionLink/ActionLink';

describe('ActionLink', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <ActionLink to="/">Link</ActionLink>
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
