// Theme presets: static data, so replacing the theme is replacing an object.
//
// A theme is plain data (see docs/features/theming.md):
//
//   { id, name, light: { '--v-...': value }, dark: { '--v-...': value } }
//
// `light` and `dark` map CSS custom properties (the tokens in
// styles/_colors.scss) to values; Theme.applyTheme() sets the map for the
// colour scheme that is showing. A token a theme leaves out keeps the
// stylesheet's value, so a theme only lists what it changes. 'volta' lists
// every token and is the one to copy when starting a new theme; a test keeps
// it equal to styles/_colors.scss.
//
// The other presets were generated to pass WCAG AA (4.5:1) for the label on
// the accent, for the accent as text on the page and on its own tint, and for
// body and secondary text, in light and dark (tests/themePreset.test.js
// enforces it). 'volta' keeps the stock accent, which does not pass (white on it
// is 3.3:1); 'volta-aa' is the same blue family moved just far enough to pass,
// for apps that need AA now. See docs/features/theming.md, "Contrast", and
// docs/backlog/resolve-contrast-failures.md.

export const presets = [
  {
    id: 'volta',
    name: 'Volta',
    light: {
      '--v-accent': '#4A90E2',
      '--v-accent-hover': '#2F90FB',
      '--v-accent-subtle': '#E5F0FC',
      '--v-on-accent': '#ffffff',
      '--v-focus-ring': 'var(--v-accent)',
      '--v-color-base': '#ffffff',
      '--v-color-base-subtle': '#e6e6e6',
      '--v-color-base-less-subtle': '#cccccc',
      '--v-color-base-more-subtle': '#f2f2f2',
      '--v-color-trim': '#111111',
      '--v-color-trim-subtle': '#4d4d4d',
      '--v-color-trim-less-subtle': '#6e6e6e',
      '--v-color-trim-more-subtle': '#1a1a1a',
      '--v-color-inactive': '#a1a5a9',
      '--v-color-danger': '#e30000',
      '--v-color-danger-hover': '#ba0000',
      '--v-color-success': '#03a10e',
      '--v-color-warning': '#a15c00',
      '--v-color-danger-subtle': '#fff2f4'
    },
    dark: {
      '--v-accent': '#4A90E2',
      '--v-accent-hover': '#2F90FB',
      '--v-accent-subtle': '#234A78',
      '--v-on-accent': '#ffffff',
      '--v-focus-ring': 'var(--v-accent)',
      '--v-color-base': '#050505',
      '--v-color-base-subtle': '#292929',
      '--v-color-base-less-subtle': '#404040',
      '--v-color-base-more-subtle': '#1c1c1c',
      '--v-color-trim': '#f1f1f1',
      '--v-color-trim-subtle': '#c2c2c2',
      '--v-color-trim-less-subtle': '#999999',
      '--v-color-trim-more-subtle': '#e6e6e6',
      '--v-color-inactive': '#7c7f82',
      '--v-color-danger': '#e30000',
      '--v-color-danger-hover': '#ba0000',
      '--v-color-success': '#03a10e',
      '--v-color-warning': '#a15c00',
      '--v-color-danger-subtle': '#3a1519'
    }
  },
  {
    id: 'volta-aa',
    name: 'Volta AA',
    light: {
      '--v-accent': '#1f6bc1',
      '--v-accent-hover': '#1a579e',
      '--v-accent-subtle': '#e3effc',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#65a1e6',
      '--v-accent-hover': '#89b7ec',
      '--v-accent-subtle': '#22374e',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    light: {
      '--v-accent': '#10798e',
      '--v-accent-hover': '#0c5a6a',
      '--v-accent-subtle': '#e2f9fd',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#23c6e7',
      '--v-accent-hover': '#47cfeb',
      '--v-accent-subtle': '#1f4951',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    light: {
      '--v-accent': '#207e3f',
      '--v-accent-hover': '#175e2f',
      '--v-accent-subtle': '#e5faec',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#3bce6c',
      '--v-accent-hover': '#5cd685',
      '--v-accent-subtle': '#264b32',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    light: {
      '--v-accent': '#b34b0f',
      '--v-accent-hover': '#8e3b0b',
      '--v-accent-subtle': '#feece1',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#f0884c',
      '--v-accent-hover': '#f4a171',
      '--v-accent-subtle': '#52311e',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    light: {
      '--v-accent': '#c91d64',
      '--v-accent-hover': '#a51853',
      '--v-accent-subtle': '#fde3ee',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#eb70a3',
      '--v-accent-hover': '#f094ba',
      '--v-accent-subtle': '#4f2134',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'violet',
    name: 'Violet',
    light: {
      '--v-accent': '#6e2fda',
      '--v-accent-hover': '#5b22bf',
      '--v-accent-subtle': '#ece3fc',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#a781e9',
      '--v-accent-hover': '#bfa4ef',
      '--v-accent-subtle': '#32234e',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'amber',
    name: 'Amber',
    light: {
      '--v-accent': '#9b6508',
      '--v-accent-hover': '#744c06',
      '--v-accent-subtle': '#fff4e0',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#f3a216',
      '--v-accent-hover': '#f5b13d',
      '--v-accent-subtle': '#54401c',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'berry',
    name: 'Berry',
    light: {
      '--v-accent': '#b526b5',
      '--v-accent-hover': '#931f93',
      '--v-accent-subtle': '#fbe4fb',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#e170e1',
      '--v-accent-hover': '#e892e8',
      '--v-accent-subtle': '#4c244c',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'indigo',
    name: 'Indigo',
    light: {
      '--v-accent': '#2f3dda',
      '--v-accent-hover': '#222fbf',
      '--v-accent-subtle': '#e3e5fc',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#818ae9',
      '--v-accent-hover': '#a4aaef',
      '--v-accent-subtle': '#23264e',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'slate',
    name: 'Slate',
    light: {
      '--v-accent': '#586c89',
      '--v-accent-hover': '#485870',
      '--v-accent-subtle': '#ebeff5',
      '--v-on-accent': '#ffffff',
      '--v-color-base': '#f8fafc',
      '--v-color-base-more-subtle': '#eceff2',
      '--v-color-base-subtle': '#e1e3e7',
      '--v-color-base-less-subtle': '#c9cdd2',
      '--v-color-trim': '#0f172a',
      '--v-color-trim-more-subtle': '#182032',
      '--v-color-trim-subtle': '#49505f',
      '--v-color-trim-less-subtle': '#656b78',
      '--v-color-inactive': '#a4a8b0'
    },
    dark: {
      '--v-accent': '#8fa0b7',
      '--v-accent-hover': '#a8b5c7',
      '--v-accent-subtle': '#31373f',
      '--v-on-accent': '#0a0a0a',
      '--v-color-base': '#0b1220',
      '--v-color-base-more-subtle': '#232a37',
      '--v-color-base-subtle': '#2b323f',
      '--v-color-base-less-subtle': '#414854',
      '--v-color-trim': '#e2e8f0',
      '--v-color-trim-more-subtle': '#d7dde6',
      '--v-color-trim-subtle': '#b7bdc6',
      '--v-color-trim-less-subtle': '#9299a3',
      '--v-color-inactive': '#6e7480'
    }
  },
  {
    id: 'graphite',
    name: 'Graphite',
    light: {
      '--v-accent': '#676d79',
      '--v-accent-hover': '#545963',
      '--v-accent-subtle': '#edeff2',
      '--v-on-accent': '#ffffff'
    },
    dark: {
      '--v-accent': '#9ca1ab',
      '--v-accent-hover': '#b2b6bd',
      '--v-accent-subtle': '#36373b',
      '--v-on-accent': '#0a0a0a'
    }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    light: {
      '--v-accent': '#946338',
      '--v-accent-hover': '#764f2d',
      '--v-accent-subtle': '#f8efe7',
      '--v-on-accent': '#ffffff',
      '--v-color-base': '#fbf6ea',
      '--v-color-base-more-subtle': '#f1ece0',
      '--v-color-base-subtle': '#e8e2d5',
      '--v-color-base-less-subtle': '#d4cec1',
      '--v-color-trim': '#3a2d1c',
      '--v-color-trim-more-subtle': '#423524',
      '--v-color-trim-subtle': '#6a5f50',
      '--v-color-trim-less-subtle': '#74695a',
      '--v-color-inactive': '#b6aea0'
    },
    dark: {
      '--v-accent': '#ca9b72',
      '--v-accent-hover': '#d5b090',
      '--v-accent-subtle': '#46372a',
      '--v-on-accent': '#0a0a0a',
      '--v-color-base': '#15110b',
      '--v-color-base-more-subtle': '#2d2821',
      '--v-color-base-subtle': '#363129',
      '--v-color-base-less-subtle': '#4c463d',
      '--v-color-trim': '#efe6d4',
      '--v-color-trim-more-subtle': '#e4dbca',
      '--v-color-trim-subtle': '#c3bbac',
      '--v-color-trim-less-subtle': '#9e978a',
      '--v-color-inactive': '#797367'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    light: {
      '--v-accent': '#087a91',
      '--v-accent-hover': '#065a6b',
      '--v-accent-subtle': '#e0faff',
      '--v-on-accent': '#ffffff',
      '--v-color-base': '#f6f8fd',
      '--v-color-base-more-subtle': '#eaedf2',
      '--v-color-base-subtle': '#dfe1e8',
      '--v-color-base-less-subtle': '#c7cbd2',
      '--v-color-trim': '#0d1526',
      '--v-color-trim-more-subtle': '#161e2f',
      '--v-color-trim-subtle': '#474e5c',
      '--v-color-trim-less-subtle': '#666b78',
      '--v-color-inactive': '#a2a6b0'
    },
    dark: {
      '--v-accent': '#16cef3',
      '--v-accent-hover': '#3dd6f5',
      '--v-accent-subtle': '#1c4b54',
      '--v-on-accent': '#0a0a0a',
      '--v-color-base': '#070b17',
      '--v-color-base-more-subtle': '#202430',
      '--v-color-base-subtle': '#292d39',
      '--v-color-base-less-subtle': '#3f444f',
      '--v-color-trim': '#e8edf8',
      '--v-color-trim-more-subtle': '#dde2ed',
      '--v-color-trim-subtle': '#bbc0cb',
      '--v-color-trim-less-subtle': '#9599a5',
      '--v-color-inactive': '#6e737e'
    }
  }
];

export const defaultPreset = presets[0];

export default presets;
