import { LOGO_PATHS } from './logoPaths';

import './Logo.scss';

// The Volta mark in a badge, coloured from the theme: the badge is the accent and the
// strokes are the colour that reads on it. Decorative: the name is written beside it.
const Logo = ({ size = 34 }) => (
  <svg className="v-logo" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
    <rect className="v-logo-badge" width="64" height="64" rx="16" />
    <g className="v-logo-mark">
      {LOGO_PATHS.map((d) => <path key={d} d={d} />)}
    </g>
  </svg>
);

export default Logo;
