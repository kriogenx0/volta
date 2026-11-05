import { render, screen } from '@testing-library/react';

import Link from '../../components/Link/Link';

describe('Link', () => {
  it('renders without crashing', () => {
    const { container } = render(<Link to="/">Home</Link>);
    expect(container).toBeInTheDocument();
  });

  it('is an anchor to `to` with the volta class', () => {
    render(<Link to="/projects">Projects</Link>);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveClass('volta-link');
  });

  it('keeps a custom class next to the volta one', () => {
    render(<Link to="/help" className="help_link">Help</Link>);
    expect(screen.getByRole('link', { name: 'Help' })).toHaveClass('volta-link', 'help_link');
  });

  it('fills :name segments from params, whatever their case', () => {
    render(<Link to="/users/:id/posts/:postId" params={{ id: 42, postId: 'a-b' }}>Post</Link>);
    expect(screen.getByRole('link', { name: 'Post' })).toHaveAttribute('href', '/users/42/posts/a-b');
  });

  it('only replaces whole param names', () => {
    render(<Link to="/a/:ids/:id" params={{ id: 1 }}>Ids</Link>);
    expect(screen.getByRole('link', { name: 'Ids' })).toHaveAttribute('href', '/a/:ids/1');
  });

  it('inserts param values literally, even with replacement patterns in them', () => {
    render(<Link to="/search/:term" params={{ term: "$&-$1" }}>Search</Link>);
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search/$&-$1');
  });

  it('copes with regex characters in a param name', () => {
    render(<Link to="/x/:a" params={{ 'a+': 1, a: 2 }}>X</Link>);
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('href', '/x/2');
  });

  it('passes other props through to the anchor', () => {
    render(<Link to="https://example.com" target="_blank" rel="noreferrer">Out</Link>);
    const link = screen.getByRole('link', { name: 'Out' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
