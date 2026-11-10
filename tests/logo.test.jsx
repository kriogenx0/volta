import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react';

import Logo from '../styleguide/views/Logo';
import { LOGO_DOT, LOGO_PILLS } from '../styleguide/views/logoShapes';

const publicFile = (name) => fs.readFileSync(path.join(__dirname, '../styleguide/public', name), 'utf8');
const parse = (text) => new DOMParser().parseFromString(text, 'image/svg+xml');
const number = (node, attribute) => Number(node.getAttribute(attribute));

// The pile as the SVG draws it: [x, y, width, height] for each pill, and the dot
const pillsOf = (root) => [...root.querySelectorAll('g rect')].map((node) => ['x', 'y', 'width', 'height'].map((a) => number(node, a)));
const dotOf = (root) => {
  const circle = root.querySelector('g circle');
  return { cx: number(circle, 'cx'), cy: number(circle, 'cy'), r: number(circle, 'r') };
};

describe('the logo files', () => {
  it.each(['logo.svg', 'logo-mono.svg'])('%s is a valid SVG named Volta', (name) => {
    const doc = parse(publicFile(name));
    expect(doc.querySelector('parsererror')).toBeNull();
    expect(doc.documentElement.nodeName).toBe('svg');
    expect(doc.documentElement.getAttribute('viewBox')).toBe('0 0 64 64');
    expect(doc.querySelector('title').textContent).toBe('Volta');
    expect(doc.documentElement.getAttribute('aria-labelledby')).toBe(doc.querySelector('title').getAttribute('id'));
  });

  it.each(['logo.svg', 'logo-mono.svg'])('%s draws the same pile as the component', (name) => {
    const doc = parse(publicFile(name));
    expect(pillsOf(doc)).toEqual(LOGO_PILLS);
    expect(dotOf(doc)).toEqual(LOGO_DOT);
    [...doc.querySelectorAll('g rect')].forEach((node, i) => expect(number(node, 'rx')).toBe(LOGO_PILLS[i][3] / 2));
  });

  it('the full logo is a badge in the stock accent with white discs', () => {
    const doc = parse(publicFile('logo.svg'));
    expect(doc.querySelector('rect').getAttribute('fill')).toBe('#4a90e2');
    expect(doc.querySelector('g').getAttribute('fill')).toBe('#fff');
  });

  it('the mono logo has no badge and takes the text colour', () => {
    const doc = parse(publicFile('logo-mono.svg'));
    expect(doc.querySelector('svg > rect')).toBeNull();
    expect(doc.querySelector('g').getAttribute('fill')).toBe('currentColor');
  });

  it('narrows from the top to the bottom, each disc centred, so the pile reads as a V', () => {
    const widths = LOGO_PILLS.map(([, , width]) => width);
    expect([...widths].sort((a, b) => b - a)).toEqual(widths);
    LOGO_PILLS.forEach(([x, , width]) => expect(x + width / 2).toBe(32));
    expect(LOGO_DOT.cx).toBe(32);
  });

  it('keeps every shape inside the 64 x 64 box with room to spare, and the discs apart', () => {
    LOGO_PILLS.forEach(([x, y, width, height], i) => {
      expect(x).toBeGreaterThanOrEqual(8);
      expect(x + width).toBeLessThanOrEqual(56);
      expect(y).toBeGreaterThanOrEqual(8);
      if (i > 0) expect(y).toBeGreaterThan(LOGO_PILLS[i - 1][1] + LOGO_PILLS[i - 1][3]); // a visible gap
      expect(y + height).toBeLessThanOrEqual(56);
    });
    expect(LOGO_DOT.cy - LOGO_DOT.r).toBeGreaterThan(LOGO_PILLS[2][1] + LOGO_PILLS[2][3]);
    expect(LOGO_DOT.cy + LOGO_DOT.r).toBeLessThanOrEqual(56);
  });

  it('is the page icon', () => {
    const html = fs.readFileSync(path.join(__dirname, '../styleguide/index.html'), 'utf8');
    expect(html).toMatch(/<link rel="icon" type="image\/svg\+xml" href="\/logo\.svg"/);
  });
});

describe('Logo component', () => {
  it('draws the pile in a badge, hidden from assistive technology', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg.v-logo');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
    expect(svg.querySelector('rect.v-logo-badge')).toBeInTheDocument();
    expect(pillsOf(svg.querySelector('.v-logo-mark').parentElement)).toEqual(LOGO_PILLS);
    expect(dotOf(svg.querySelector('.v-logo-mark').parentElement)).toEqual(LOGO_DOT);
  });

  it('is 34px by default and any size on request', () => {
    const { container, rerender } = render(<Logo />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '34');
    rerender(<Logo size={64} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '64');
    expect(container.querySelector('svg')).toHaveAttribute('height', '64');
  });
});
