// Icons drawn as inline SVG, so they show without any icon font being loaded.
//
// Each is a list of path `d` strings on a 24 x 24 grid, stroked in
// `currentColor` (so they take the text colour) with round ends. The font icons
// in icons.js need the "Volta Icons" or SF Symbols fonts, which the library
// doesn't ship; these don't.

export default {
  trash: [
    'M4 7h16',
    'M9 7V4.5h6V7',
    'M6 7l.9 12.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L18 7',
    'M10 11v6M14 11v6'
  ],
  // An open ring; spin it to show something is loading (Icon does, for this type)
  spinner: [
    'M12 3a9 9 0 1 0 9 9'
  ],
  'cloud-upload': [
    'M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5 4.25 4.25 0 0 1 17.5 18',
    'M12 20v-8',
    'M8.5 14.5L12 11l3.5 3.5'
  ],
  'check-circle': [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    'M7.8 12.4l3 3 5.4-6'
  ],
  'times-circle': [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    'M9 9l6 6M15 9l-6 6'
  ],
  'arrow-up-circle': [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    'M12 16V8M8.5 11.5L12 8l3.5 3.5'
  ]
};
