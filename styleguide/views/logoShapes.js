// The shapes of the Volta mark: a voltaic pile, the stack of discs Volta built the first
// battery from, narrowing to a V, with a small spark below it. In a 64 x 64 box. The same
// geometry is in public/logo.svg and public/logo-mono.svg (tests/logo.test.jsx checks they
// agree).

// The three discs, widest at the top: [x, y, width, height]. Each is a pill (rx is half its height).
export const LOGO_PILLS = [
  [11, 11, 42, 9],
  [17, 23, 30, 9],
  [23, 35, 18, 9]
];

// The spark under the pile
export const LOGO_DOT = { cx: 32, cy: 51, r: 3.5 };
