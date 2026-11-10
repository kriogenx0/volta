import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react';

import Logo from '../styleguide/views/Logo';
import { LOGO_PATHS, LOGO_STROKE_WIDTH } from '../styleguide/views/logoPaths';

const publicFile = (name) => fs.readFileSync(path.join(__dirname, '../styleguide/public', name), 'utf8');
const parse = (text) => new DOMParser().parseFromString(text, 'image/svg+xml');
const pathsOf = (doc) => [...doc.querySelectorAll('path')].map((node) => node.getAttribute('d'));

describe('the logo files', () => {
  it.each(['logo.svg', 'logo-mono.svg'])('%s is a valid SVG named Volta', (name) => {
    const doc = parse(publicFile(name));
    expect(doc.querySelector('parsererror')).toBeNull();
    expect(doc.documentElement.nodeName).toBe('svg');
    expect(doc.documentElement.getAttribute('viewBox')).toBe('0 0 64 64');
    expect(doc.querySelector('title').textContent).toBe('Volta');
    expect(doc.documentElement.getAttribute('aria-labelledby')).toBe(doc.querySelector('title').getAttribute('id'));
  });

  it.each(['logo.svg', 'logo-mono.svg'])('%s draws the same strokes as the component', (name) => {
    const doc = parse(publicFile(name));
    expect(pathsOf(doc)).toEqual(LOGO_PATHS);
    expect(doc.querySelector('g').getAttribute('stroke-width')).toBe(String(LOGO_STROKE_WIDTH));
  });

  it('the full logo is a badge in the stock accent with white strokes', () => {
    const doc = parse(publicFile('logo.svg'));
    expect(doc.querySelector('rect').getAttribute('fill')).toBe('#4a90e2');
    expect(doc.querySelector('g').getAttribute('stroke')).toBe('#fff');
  });

  it('the mono logo has no badge and takes the text colour', () => {
    const doc = parse(publicFile('logo-mono.svg'));
    expect(doc.querySelector('rect')).toBeNull();
    expect(doc.querySelector('g').getAttribute('stroke')).toBe('currentColor');
  });

  it('every stroke stays inside the 64 x 64 box with room for its width', () => {
    LOGO_PATHS.forEach((d) => {
      (d.match(/-?\d+(\.\d+)?/g) || []).map(Number).forEach((n) => {
        expect(n).toBeGreaterThanOrEqual(LOGO_STROKE_WIDTH / 2);
        expect(n).toBeLessThanOrEqual(64 - LOGO_STROKE_WIDTH / 2);
      });
    });
  });

  it('is the page icon', () => {
    const html = fs.readFileSync(path.join(__dirname, '../styleguide/index.html'), 'utf8');
    expect(html).toMatch(/<link rel="icon" type="image\/svg\+xml" href="\/logo\.svg"/);
  });
});

describe('Logo component', () => {
  it('draws the strokes in a badge, hidden from assistive technology', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg.v-logo');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
    expect(svg.querySelector('rect.v-logo-badge')).toBeInTheDocument();
    expect([...svg.querySelectorAll('.v-logo-mark path')].map((node) => node.getAttribute('d'))).toEqual(LOGO_PATHS);
  });

  it('is 34px by default and any size on request', () => {
    const { container, rerender } = render(<Logo />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '34');
    rerender(<Logo size={64} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '64');
    expect(container.querySelector('svg')).toHaveAttribute('height', '64');
  });
});
