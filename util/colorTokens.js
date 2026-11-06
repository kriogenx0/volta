// The `--v-*` design tokens declared in styles/_colors.scss, read as data so they can be
// written to styles/tokens.json (docs/features/tokens_json.md). Pure functions on the
// stylesheet's text; nothing here knows about components.

// `--v-name: value;` declarations inside the first block that starts with `opener`
// (comments dropped). Returns { '--v-name': 'value' } with the values as written.
export function declarationsIn(scss, opener) {
  const block = scss.match(new RegExp(`${opener}\\s*\\{([^}]*)\\}`));
  if (!block) throw new Error(`No "${opener}" block in the stylesheet`);
  const found = {};
  [...block[1].replace(/\/\/.*$/gm, '').matchAll(/(--v-[a-z0-9-]+):\s*([^;]+);/g)].forEach(([, name, value]) => {
    found[name] = value.trim();
  });
  return found;
}

// Every token with its value in light and in dark. A token the dark palette doesn't
// override has the same value in both, as it does in the browser.
export function colorTokens(scss) {
  const light = declarationsIn(scss, ':root');
  const dark = { ...light, ...declarationsIn(scss, '@mixin dark-palette') };
  return Object.fromEntries(Object.keys(light).map(name => [name, { light: light[name], dark: dark[name] }]));
}

// The text of styles/tokens.json for a stylesheet.
export function tokensJson(scss) {
  return `${JSON.stringify({
    generated: 'From styles/_colors.scss by `make tokens`. Do not edit by hand.',
    tokens: colorTokens(scss)
  }, null, 2)}\n`;
}
