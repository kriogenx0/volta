// Icons drawn as inline SVG, so they show without any icon font being loaded.
//
// Each is a list of shapes on a 24 x 24 grid. A shape is, by default, a path `d` string
// stroked in `currentColor` (so it takes the text colour) with round ends. Two other
// kinds make the "fill" icons:
//   { d, fill: true }      a solid shape in the text colour
//   { d, knockout: true }  a stroke in the page colour, cut out of a solid shape
// The font icons in icons.js need the "Volta Icons" or SF Symbols fonts, which the
// library doesn't ship; these don't.

const CIRCLE = 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z';
const DOC = 'M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z';
const FOLDER = 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z';
const STAR = 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z';
const TRIANGLE = 'M12 3.5l9.5 16.5h-19z';

// The icons, by name. Names follow SF Symbols where there is one, so code written for
// those fonts keeps working; `aliases` below are other names for the same drawing.
const icons = {
  // marks
  xmark: ['M6 6l12 12M18 6L6 18'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  checkmark: ['M5 12.5l4.5 4.5L19 7.5'],
  ellipsis: ['M5 12h.01M12 12h.01M19 12h.01'],

  // arrows
  'chevron.right': ['M9 5l7 7-7 7'],
  'chevron.left': ['M15 5l-7 7 7 7'],
  'chevron.down': ['M5 9l7 7 7-7'],
  'chevron.up': ['M5 15l7-7 7 7'],
  'arrow.right': ['M4 12h16M14 6l6 6-6 6'],
  'arrow.left': ['M20 12H4M10 6l-6 6 6 6'],
  'arrow.up': ['M12 20V4M6 10l6-6 6 6'],
  'arrow.down': ['M12 4v16M6 14l6 6 6-6'],
  'arrow.clockwise': ['M20 12a8 8 0 1 1-2.3-5.7', 'M20 4v5h-5'],
  'arrow-up-circle': [CIRCLE, 'M12 16V8M8.5 11.5L12 8l3.5 3.5'],
  'rectangle.compress.vertical': ['M5 4h14M5 20h14', 'M9 8l3 3 3-3M9 16l3-3 3 3'],
  'rectangle.expand.vertical': ['M5 4h14M5 20h14', 'M9 11l3-3 3 3M9 13l3 3 3-3'],

  // circles and status
  circle: [CIRCLE],
  'circle.fill': [{ d: CIRCLE, fill: true }],
  'checkmark.circle.fill': [{ d: CIRCLE, fill: true }, { d: 'M7.8 12.4l3 3 5.4-6', knockout: true }],
  'xmark.circle.fill': [{ d: CIRCLE, fill: true }, { d: 'M9 9l6 6M15 9l-6 6', knockout: true }],
  'exclamationmark.circle.fill': [{ d: CIRCLE, fill: true }, { d: 'M12 7.5v5.5M12 16.5h.01', knockout: true }],
  'plus.circle.fill': [{ d: CIRCLE, fill: true }, { d: 'M12 7.5v9M7.5 12h9', knockout: true }],
  'chevron.backward.circle.fill': [{ d: CIRCLE, fill: true }, { d: 'M13.5 8l-4 4 4 4', knockout: true }],
  'check-circle': [CIRCLE, 'M7.8 12.4l3 3 5.4-6'],
  'times-circle': [CIRCLE, 'M9 9l6 6M15 9l-6 6'],
  'info.circle': [CIRCLE, 'M12 11v6M12 7.5h.01'],
  'questionmark.circle': [CIRCLE, 'M9.6 9.6a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1 1-1.1 1.7M12 17h.01'],
  questionmark: ['M8.5 8.8a3.6 3.6 0 1 1 5.4 3.1c-1.2.7-1.9 1.5-1.9 2.9', 'M12 19h.01'],
  'exclamationmark.triangle': [TRIANGLE, 'M12 10v4.5M12 17.5h.01'],
  'exclamationmark.triangle.fill': [{ d: TRIANGLE, fill: true }, { d: 'M12 10v4.5M12 17.5h.01', knockout: true }],

  // things
  magnifyingglass: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z', 'M16 16l4.5 4.5'],
  pencil: ['M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z', 'M14 7l3 3'],
  'square.and.pencil': ['M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5', 'M18 3.5a2 2 0 0 1 2.8 2.8L12 15l-4 1 1-4z'],
  trash: ['M4 7h16', 'M9 7V4.5h6V7', 'M6 7l.9 12.2a1 1 0 0 0 .8 1h8.2a1 1 0 0 0 .8-1L18 7', 'M10 11v6M14 11v6'],
  doc: [DOC, 'M14 3v5h5'],
  'doc.fill': [{ d: DOC, fill: true }, { d: 'M14 3v5h5', knockout: true }],
  folder: [FOLDER],
  'folder.fill': [{ d: FOLDER, fill: true }],
  gear: ['M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z', 'M12 2.5v3.5M12 18v3.5M2.5 12H6M18 12h3.5M5.3 5.3l2.5 2.5M16.2 16.2l2.5 2.5M5.3 18.7l2.5-2.5M16.2 7.8l2.5-2.5'],
  bell: ['M18 9a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9z', 'M10.3 20a2 2 0 0 0 3.4 0'],
  person: ['M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M4.5 20a7.5 7.5 0 0 1 15 0'],
  'person.crop.circle': [CIRCLE, 'M12 7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M6.2 18.2a6.5 6.5 0 0 1 11.6 0'],
  envelope: ['M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z', 'M3.5 7.5l8.5 6 8.5-6'],
  phone: ['M6 3h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z'],
  star: [STAR],
  'star.fill': [{ d: STAR, fill: true }],
  heart: ['M12 20s-7.5-4.6-9-9.2C1.9 7.5 4 4.5 7 4.5c2 0 3.6 1 5 3 1.4-2 3-3 5-3 3 0 5.1 3 4 6.3-1.5 4.6-9 9.2-9 9.2z'],
  bookmark: ['M6 3h12v18l-6-4.5L6 21z'],
  flag: ['M5 21V4M5 4h11l-2 4 2 4H5'],
  'house.fill': [{ d: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', fill: true }],
  globe: [CIRCLE, 'M3 12h18', 'M12 3c3 3 3 15 0 18-3-3-3-15 0-18z'],
  clock: [CIRCLE, 'M12 7v5l3 2'],
  image: ['M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8.5 8.5h.01', 'M3 16l5-5 4 4 3-3 6 6'],
  'list.clipboard': ['M9 3.5h6V7H9z', 'M15 5.5h2a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h2', 'M8.5 12h7M8.5 16h7'],
  'list.bullet': ['M9 6h11M9 12h11M9 18h11', 'M4.5 6h.01M4.5 12h.01M4.5 18h.01'],
  'video.slash': ['M3 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 10.5l5-3v9l-5-3', 'M3 3l18 18'],
  play: ['M8 5l11 7-11 7z'],
  'cloud-upload': ['M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5 4.25 4.25 0 0 1 17.5 18', 'M12 20v-8', 'M8.5 14.5L12 11l3.5 3.5'],
  'square.and.arrow.down': ['M12 4v11M7.5 10.5L12 15l4.5-4.5', 'M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3'],
  // An open ring; spin it to show something is loading (Icon does, for this type)
  spinner: ['M12 3a9 9 0 1 0 9 9']
};

// Other names for the same drawings: the font icons' names, and the common spellings.
const aliases = {
  x: 'xmark',
  question: 'questionmark',
  close: 'xmark',
  multiply: 'xmark',
  times: 'xmark',
  check: 'checkmark',
  search: 'magnifyingglass',
  'pencil-alt': 'pencil',
  chevrondown: 'chevron.down',
  chevronup: 'chevron.up',
  chevronleft: 'chevron.left',
  chevronright: 'chevron.right',
  checkcircle: 'check-circle',
  infocircle: 'info.circle',
  questioncircle: 'questionmark.circle',
  exclamation: 'exclamationmark.triangle',
  'exclamation.triangle': 'exclamationmark.triangle',
  mail: 'envelope',
  link: 'arrow.right',
  favorite: 'star',
  download: 'square.and.arrow.down',
  settings: 'gear'
};

// Every name that draws as SVG, with the aliases sharing their drawing.
export default {
  ...icons,
  ...Object.fromEntries(Object.entries(aliases).map(([alias, name]) => [alias, icons[name]]))
};

// The drawings themselves, each once, for a grid of them.
export const iconNames = Object.keys(icons);

export const aliasesOf = (name) => Object.keys(aliases).filter((alias) => aliases[alias] === name);
