# Component guidelines

Every component that `components/index.js` exports (89 component directories, with the extra exports of a directory documented in its README) has a guideline at `components/<Directory>/README.md`: what it is for, when to use it and when not to, how to call it, its props, how it works for keyboard and screen-reader users, and what to avoid. They are written from the code (the component, its stylesheet and its propTypes), for a person or an AI agent building a screen with Volta, and are the text to copy into the design-system artifact's per-component pages.

## What it does for users

- **One place per component.** Open `components/Button/README.md` to learn how to use `Button`; the directory also holds the code and the styles.
- **Checked against the code.** `tests/componentReadmes.test.js` fails when a README is missing or incomplete, when its props table leaves out a propType (or lists a prop the component's source never mentions), when its Usage example doesn't parse or imports a name the library doesn't export, or when a link points at a missing file. A README that no longer matches a component's props is a failing test.

## The format

A directory with several exports (`DatePicker` also exports `CalendarMini` and `DateFormat`) has one README, titled with the first export `index.js` imports from it; the other exports each get a section of their own.

````markdown
# Name

One line saying what it is (not a heading, directly after the title).

## When to use

When it fits, and which component to use instead when it doesn't.

## Usage

```jsx
import { Name } from 'volta';

<Name someProp="value" />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `someProp` | `string` | `''` | What it does |

## Accessibility

Roles, labels, keyboard operation, focus, and what the caller must supply.

## Do and don't

Short bullets.
````

Rules the test enforces: the five `##` sections above, in that order (extra sections, such as `## Variants and states` or `## Theming`, go anywhere between them); the title contains the export name; a `jsx` block in Usage that is valid module code (siblings are wrapped in `<>…</>`, an expression ends with `;`) and whose `import … from 'volta'` names are real exports; every propType in the table, with the prop name in backticks in the first column; every other name in the table is a word that appears in the directory's source; other exports are mentioned in a heading, and an export with propTypes of its own gets a `## <Export> props` table.

What the rules leave to the writer, and what to cover: the props that matter first; defaults as the code has them; the legacy spellings a component still accepts, marked as legacy; the theme tokens or classes that decide the look when that is what someone customising it needs; behaviour that surprises (a controlled and an uncontrolled mode, a required provider, a global it needs).

## Known limits

- **Found while writing them.** The READMEs say what the code does today, including its gaps (a component with no keyboard access says so). The problems found are listed in `docs/backlog/fix-issues-found-writing-component-guidelines.md`; fixing one means updating its README, and the test fails until the props table matches.
- The examples are checked for syntax and imports only; they are not rendered. The styleguide (`npm start`) renders each component's real examples.
- The Do and don't sections are advice drawn from the design rules in `docs/project/design-system.md` and the component's code; nobody has reviewed them as product decisions.
- Not copied into the design-system artifact: that needs the artifact's account (see `docs/backlog/write-design-system-component-guidelines.md`).

## History

- Implemented 2026-11-06 on branch `backlog/write-design-system-component-guidelines`. Not merged or deployed.
