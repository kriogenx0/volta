// JS-side mirror of styles/_colors.scss, for components that need color
// values in inline styles/objects rather than stylesheet rules (e.g.
// react-select's style-object API). These read the live CSS custom
// properties, so they stay in sync with setAccentColor()/setColorScheme().
const cssVar = (name, fallback) =>
  typeof window === 'undefined'
    ? fallback
    : `var(${name}, ${fallback})`;

const colors = {
  base: cssVar('--v-color-base', '#ffffff'),
  border: cssVar('--v-color-base-less-subtle', '#cccccc'),
  background: cssVar('--v-color-base-subtle', '#e6e6e6'),
  text: {
    bodyCopy: cssVar('--v-color-trim', '#111111'),
  },
  multiselect: {
    border: cssVar('--v-color-base-less-subtle', '#cccccc'),
    text: cssVar('--v-color-trim', '#111111'),
    iconColor: cssVar('--v-color-trim-subtle', '#4d4d4d'),
    primary25: cssVar('--v-accent-subtle', '#e5f0fc'),
    neutral10: cssVar('--v-color-base-more-subtle', '#f2f2f2'),
  },
};

export default colors;
