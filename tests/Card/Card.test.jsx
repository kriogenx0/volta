import fs from 'fs';
import path from 'path';
import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent } from '@testing-library/react';

import Card from '../../components/Card/Card';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('adds the selectable class', () => {
    render(<Card selectable>Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('volta-card-selectable');
  });

  it('adds the selected class', () => {
    render(<Card selected>Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('volta-card-selected');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Hello</Card>);
    fireEvent.click(screen.getByText('Hello'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to medium padding', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('volta-card--md');
  });

  it('applies the padding prop as a modifier class', () => {
    const { rerender } = render(<Card padding="sm">Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('volta-card--sm');
    rerender(<Card padding="none">Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('volta-card--none');
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('Card with the automatic JSX runtime', () => {
  it('applies the default medium padding', () => {
    render(jsx(Card, { children: 'Hello' }));
    expect(screen.getByText('Hello')).toHaveClass('volta-card--md');
  });
});

// jsdom loads no CSS, so the hover state is checked in the stylesheet's source.
describe('Card hover', () => {
  const scss = fs.readFileSync(path.join(__dirname, '../../components/Card/Card.scss'), 'utf8');
  const hoverRules = [...scss.matchAll(/([^{}]*:hover[^{}]*)\{([^}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim(), body }));

  it('reacts to the pointer only when the card is selectable', () => {
    expect(hoverRules.length).toBeGreaterThan(0);
    hoverRules.forEach(({ selector }) => expect(selector).toContain('.volta-card-selectable'));
  });

  it('changes the border and fill of an unselected card, and the border of a selected one', () => {
    const plain = hoverRules.find(({ selector }) => selector.includes(':not(.volta-card-selected)'));
    expect(plain.body).toMatch(/border-color:\s*var\(--v-color-base-less-subtle\)/);
    expect(plain.body).toMatch(/background-color:\s*var\(--v-color-base-more-subtle\)/);
    const selected = hoverRules.find(({ selector }) => selector.includes('.volta-card-selected:hover'));
    expect(selected.body).toMatch(/border-color:\s*var\(--v-accent-hover\)/);
  });

  it('never changes size or position on hover', () => {
    hoverRules.forEach(({ body }) => expect(body).not.toMatch(/\b(padding|margin|width|height|border-width|transform)\s*:/));
  });
});
