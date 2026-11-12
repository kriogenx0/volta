const fs = require('fs');
const path = require('path');
const sass = require('sass');

const ROOT = path.join(__dirname, '..');

// A disabled or read-only control, or one nobody can interact with, shows no hover or
// press change: not a colour, not a border, not a size. jsdom has no CSS, so this reads
// the compiled stylesheets: a `:hover` or `:active` rule on a control that can be
// disabled has to exclude the disabled state in its selector, or be undone by a
// disabled rule that follows it (listed in UNREACHABLE, with the reason).

const compile = (file) => sass.compile(path.join(ROOT, file), { loadPaths: [ROOT], silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'], logger: sass.Logger.silent }).css;

const rules = (css) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim(), body }));

const DISABLED = /:disabled|\[disabled\]|\[aria-disabled|--disabled|-disabled|\.is-disabled/;

// Stylesheets of components that can be disabled, and the class or attribute that marks it
const FILES = [
  'components/Button/Button.scss',
  'components/CloseButton/CloseButton.scss',
  'components/IconButton/IconButton.scss',
  'components/Checkbox/Checkbox.scss',
  'components/Radio/Radio.scss',
  'components/Toggle/Toggle.scss',
  'components/Slider/Slider.scss',
  'components/SegmentedControl/SegmentedControl.scss',
  'components/TextEditable/TextEditable.scss',
  'components/DatePicker/Calendar.scss',
  'components/Form/BaseForm.scss'
];

// Hover and active rules that can't reach a disabled control, for a reason the selector
// doesn't show.
const UNREACHABLE = new Set([
  // A disabled day has `day-disabled` instead of `day-active`
  '.volta-date_picker_calendar .day-active:hover',
  '.volta-date_picker_calendar .day-current.day-active:hover',
  // `.is-disabled` and `:disabled` set the background after the hover rule
  '.volta-base_form .btn:hover'
]);

// `:not(:disabled)`, `:not([disabled])`, `:not(.x-disabled)` and the like
const excludesDisabled = (selector) => /:not\([^)]*disabled[^)]*\)/.test(selector);

describe('hover and press states of controls that can be disabled', () => {
  it.each(FILES)('%s: every :hover or :active rule excludes the disabled state', (file) => {
    const offenders = rules(compile(file))
      .flatMap(({ selector }) => selector.split(',').map((part) => part.trim()))
      .filter((selector) => /:hover|:active/.test(selector))
      .filter((selector) => !excludesDisabled(selector) && !DISABLED.test(selector))
      .filter((selector) => !UNREACHABLE.has(selector));
    expect(offenders).toEqual([]);
  });
});

describe('the shared field look', () => {
  it('does not change the border on hover when the field is disabled', () => {
    const css = compile('components/TextBox/TextBox.scss');
    const hover = rules(css).filter(({ selector }) => /input:hover/.test(selector) && !/error|autofill/.test(selector));
    expect(hover.length).toBeGreaterThan(0);
    hover.forEach(({ selector }) => expect(selector).toMatch(/:not\(:disabled\)/));
  });

  it('dims a disabled field and shows the not-allowed cursor', () => {
    const css = compile('components/TextBox/TextBox.scss');
    const disabled = rules(css).find(({ selector, body }) => /input:disabled/.test(selector) && /opacity/.test(body));
    expect(disabled).toBeDefined();
    expect(disabled.body).toMatch(/cursor:\s*not-allowed/);
  });
});
