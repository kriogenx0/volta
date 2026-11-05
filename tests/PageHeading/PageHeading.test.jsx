import { render, screen } from '@testing-library/react';

import PageHeading from '../../components/PageHeading/PageHeading';

describe('PageHeading', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageHeading />);
    expect(container).toBeInTheDocument();
  });

  it('shows the text as the page h1', () => {
    render(<PageHeading text="Projects" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  });

  it('renders children as actions opposite the title', () => {
    const { container } = render(
      <PageHeading text="Projects">
        <button type="button">New project</button>
      </PageHeading>
    );
    const actions = container.querySelector('.l-r');
    expect(actions).toContainElement(screen.getByRole('button', { name: 'New project' }));
    expect(container.querySelector('.l-l')).toContainElement(screen.getByRole('heading'));
  });
});
