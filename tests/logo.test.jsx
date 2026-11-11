import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react';

import Logo from '../styleguide/views/Logo';
import { LOGO_POINTS } from '../styleguide/views/logoShapes';

const publicFile = (name) => fs.readFileSync(path.join(__dirname, '../styleguide/public', name), 'utf8');
const parse = (text) => new DOMParser().parseFromString(text, 'image/svg+xml');

const pointsOf = (root) => root.querySelector('polygon').getAttribute('points');
// The corners of the polygon as numbers
const corners = (points) => points.trim().split(/\s+/).map((pair) => pair.split(',').map(Number));

describe('the logo files', () => {
  it.each(['logo.svg', 'logo-mono.svg'])('%s is a valid SVG named Volta', (name) => {
    const doc = parse(publicFile(name));
    expect(doc.querySelector('parsererror')).toBeNull();
    expect(doc.documentElement.nodeName).toBe('svg');
    expect(doc.documentElement.getAttribute('viewBox')).toBe('0 0 64 64');
    expect(doc.querySelector('title').textContent).toBe('Volta');
    expect(doc.documentElement.getAttribute('aria-labelledby')).toBe(doc.querySelector('title').getAttribute('id'));
  });

  it.each(['logo.svg', 'logo-mono.svg'])('%s draws the same V as the component', (name) => {
    expect(pointsOf(parse(publicFile(name)))).toBe(LOGO_POINTS);
  });

  it('the full logo is a badge in the stock accent with a white V', () => {
    const doc = parse(publicFile('logo.svg'));
    expect(doc.querySelector('rect').getAttribute('fill')).toBe('#4a90e2');
    expect(doc.querySelector('polygon').getAttribute('fill')).toBe('#fff');
  });

  it('the mono logo has no badge and takes the text colour', () => {
    const doc = parse(publicFile('logo-mono.svg'));
    expect(doc.querySelector('svg > rect')).toBeNull();
    expect(doc.querySelector('polygon').getAttribute('fill')).toBe('currentColor');
  });

  it('is a V: it points down to the bottom centre and opens to two arms at the top', () => {
    const points = corners(LOGO_POINTS);
    const bottom = points.reduce((low, point) => (point[1] > low[1] ? point : low));
    expect(bottom[0]).toBe(32);
    const top = points.filter(([, y]) => y === Math.min(...points.map((point) => point[1])));
    expect(top).toHaveLength(4);
    // the arms start left and right of the centre, with a gap between them
    expect(top.filter(([x]) => x < 32)).toHaveLength(2);
    expect(top.filter(([x]) => x > 32)).toHaveLength(2);
  });

  it('keeps every corner inside the 64 x 64 box with room to spare', () => {
    corners(LOGO_POINTS).forEach(([x, y]) => {
      expect(x).toBeGreaterThanOrEqual(8);
      expect(x).toBeLessThanOrEqual(56);
      expect(y).toBeGreaterThanOrEqual(8);
      expect(y).toBeLessThanOrEqual(56);
    });
  });

  it('is the page icon', () => {
    const html = fs.readFileSync(path.join(__dirname, '../styleguide/index.html'), 'utf8');
    expect(html).toMatch(/<link rel="icon" type="image\/svg\+xml" href="\/logo\.svg"/);
  });
});

describe('Logo component', () => {
  it('draws the V in a badge, hidden from assistive technology', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg.v-logo');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
    expect(svg.querySelector('rect.v-logo-badge')).toBeInTheDocument();
    expect(svg.querySelector('polygon.v-logo-mark')).toHaveAttribute('points', LOGO_POINTS);
  });

  it('is 34px by default and any size on request', () => {
    const { container, rerender } = render(<Logo />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '34');
    rerender(<Logo size={64} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '64');
    expect(container.querySelector('svg')).toHaveAttribute('height', '64');
  });
});
