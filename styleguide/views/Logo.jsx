import { LOGO_DOT, LOGO_PILLS } from './logoShapes';

import './Logo.scss';

// The Volta mark in a badge, coloured from the theme: the badge is the accent and the
// pile is the colour that reads on it. Decorative: the name is written beside it.
const Logo = ({ size = 34 }) => (
  <svg className="v-logo" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
    <rect className="v-logo-badge" width="64" height="64" rx="16" />
    <g className="v-logo-mark">
      {LOGO_PILLS.map(([x, y, width, height]) => (
        <rect key={y} x={x} y={y} width={width} height={height} rx={height / 2} />
      ))}
      <circle cx={LOGO_DOT.cx} cy={LOGO_DOT.cy} r={LOGO_DOT.r} />
    </g>
  </svg>
);

export default Logo;
