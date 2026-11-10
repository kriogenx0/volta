// The text of the Naming page: static data, so the view only lays it out.
// docs/features/naming_conventions.md describes the page; keep the two in step.

// Each convention: a rule, why it exists, and optionally a preferred / avoided pair.
export const conventions = [
  {
    title: 'Prefer the shorter name',
    body: 'When two names mean the same thing, use the shorter one. Short names are quicker to type and read, and they keep JSX and import lines from wrapping.',
    prefer: ['TextBox', 'DatePicker'],
    avoid: ['TextField', 'DateInput'],
    note: 'The longer names are still exported, as other names for the same component (TextField === TextBox), so existing code keeps working. New code uses the short one.',
  },
  {
    title: 'One component, other names are aliases',
    body: 'A component has one implementation. A second name is a constant pointing at it, never a copy. A variant that changes how it renders is a prop, not a sibling component.',
    prefer: ['<TextBox multiline />', '<SegmentedControl mini />'],
    avoid: ['Textarea', 'SegmentedControlMini'],
    note: 'Textarea and SegmentedControlMini stay exported as aliases. Aliases are not listed as components in the sidebar.',
  },
  {
    title: 'Variants are props',
    body: 'Look, size and state are props with a small set of values. They are not new class names or new components.',
    prefer: ['<Button variant="primary" size="small">'],
    avoid: ['<Button bsStyle="primary" tiny>'],
  },
  {
    title: 'Names, files and folders',
    body: 'Components are PascalCase, and a component’s folder, files and exports share its name. File names are singular.',
    prefer: ['components/TextBox/TextBox.jsx', 'components/TextBox/TextBox.scss', 'examples/TextBox/TextBox-examples.jsx'],
  },
  {
    title: 'Class names',
    body: 'A component’s root class is prefixed with volta- (a view’s with view-). A single dash marks inheritance or a relationship, two dashes a state or modifier of one class, and underscores join the words of one term. No ids.',
    prefer: ['volta-textbox', 'volta-textbox--sm', 'volta-text_editable'],
  },
  {
    title: 'Docs and tasks',
    body: 'Backlog task files are kebab-case and descriptive, never numbered. Feature docs are snake_case and named for the feature.',
    prefer: ['docs/backlog/add-missing-design-tokens.md', 'docs/features/naming_conventions.md'],
  },
];

// The design principles every page and component is held to (docs/rules/design-principles.md).
export const principles = [
  'Responsive on all devices: fits a 375px screen without horizontal scrolling, with touch targets big enough to tap.',
  'Native controls look the same everywhere: dialogs, buttons, text fields, selects, checkboxes and radios are styled.',
  'Interactive things react to the cursor; nothing else does.',
  'Global, then app, then view: each layer overrides the one below it.',
  'Text never touches the edge of the viewport.',
  'Animations are fast (150ms).',
  'Hover and other state changes never change an element’s size or position.',
  'UI text that no one would select isn’t selectable.',
  'Views only show things of value: no pagination for one page.',
  'No invisible masks: the area that reacts matches the visible boundary.',
  'Show that something is happening while the user waits.',
];

// Rules specific to the Volta design system (docs/project/design-system.md).
export const systemRules = [
  'Use tokens, never literals: every colour, space, radius, shadow and z-index comes from a --v-* variable.',
  'One variable, two themes: a colour token flips in dark mode, so reference it once.',
  'Reuse before you build: compose existing components, or add a variant prop, rather than a sibling component.',
  'Every interactive element has a visible focus state, a hover state, a disabled state, and works from the keyboard.',
  'Meet WCAG 2.1: 4.5:1 contrast for body text, and never convey state by colour alone.',
];
