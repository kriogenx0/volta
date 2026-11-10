import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';

import Empty, { EmptyState } from '../../components/Empty/Empty';

describe('Empty', () => {
  it('renders without crashing', () => {
    const { container } = render(<Empty />);
    expect(container).toBeInTheDocument();
  });

  it('shows the message as it did, in one div', () => {
    const { container } = render(<Empty>No results</Empty>);
    expect(container.firstChild).toHaveClass('volta-empty');
    expect(container.firstChild).toHaveTextContent('No results');
    expect(container.firstChild).not.toHaveAttribute('role');
    expect(container.querySelector('.volta-loader')).toBeNull();
  });

  it('shows a big icon above the message, hidden from assistive technology', () => {
    const { container } = render(<Empty icon="questionmark">Not found</Empty>);
    const icon = container.querySelector('.volta-empty-icon');
    expect(icon).toHaveAttribute('data-type', 'questionmark');
    expect(icon).toHaveClass('icon-svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstChild.firstChild).toBe(icon);
    expect(container.firstChild).toHaveTextContent('Not found');
  });

  it('shows a Loader instead of the message and icon while loading, with the message as its caption', () => {
    const { container } = render(<Empty loading icon="questionmark">Loading projects</Empty>);
    expect(container.querySelector('.volta-loader')).toBeInTheDocument();
    expect(container.querySelector('.volta-loader .message')).toHaveTextContent('Loading projects');
    expect(container.querySelector('.volta-empty-icon')).toBeNull();
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('goes from loading to the message when loading stops', () => {
    const { container, rerender } = render(<Empty loading>Working</Empty>);
    expect(container.querySelector('.volta-loader')).toBeInTheDocument();
    rerender(<Empty loading={false}>No projects yet.</Empty>);
    expect(container.querySelector('.volta-loader')).toBeNull();
    expect(container.firstChild).toHaveTextContent('No projects yet.');
    expect(container.firstChild).not.toHaveAttribute('aria-busy');
  });

  it('shows just the loader when there is nothing to say', () => {
    const { container } = render(<Empty loading />);
    expect(container.querySelector('.volta-loader')).toBeInTheDocument();
    expect(container.querySelector('.volta-loader .message')).toBeNull();
  });

  it('renders the empty state message', () => {
    render(<EmptyState>Nothing here yet</EmptyState>);
    expect(screen.getByText('Nothing here yet')).toHaveClass('volta-empty_state-text');
    expect(screen.getByText('Nothing here yet').parentElement).toHaveClass('volta-empty_state');
  });
});

// jsdom loads no CSS, so the look is checked in the stylesheet's source.
describe('Empty font', () => {
  const scss = fs.readFileSync(path.join(__dirname, '../../components/Empty/Empty.scss'), 'utf8');
  const rule = scss.match(/\.volta-empty \{[\s\S]*?\n\}/)[0];

  it('is soft: a muted colour, regular weight and a size that does not shout', () => {
    expect(rule).toMatch(/color:\s*var\(--v-color-trim-less-subtle\);/);
    expect(rule).toMatch(/font-weight:\s*400;/);
    expect(parseInt(rule.match(/font-size:\s*(\d+)%/)[1], 10)).toBeLessThanOrEqual(130);
  });

  it('is not brighter in dark mode: one colour token for both schemes', () => {
    expect(rule).not.toMatch(/@include dark/);
    expect(rule).not.toMatch(/var\(--v-color-trim\)/);
  });
});
