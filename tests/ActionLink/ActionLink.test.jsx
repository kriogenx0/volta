import { render, screen } from '@testing-library/react';
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

  it('links to the target and keeps a custom class', () => {
    render(
      <MemoryRouter>
        <ActionLink to="/settings" className="extra">Settings</ActionLink>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveClass('volta-action_link', 'extra');
  });
});
