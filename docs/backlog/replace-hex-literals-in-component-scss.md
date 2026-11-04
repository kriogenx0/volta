---
priority: p2
depends_on: [add-missing-design-tokens]
---

# Replace hard-coded hex values in component SCSS

About 130 hex literals remain in `components/**/*.scss` (re-measure). Most frequent: `#ccc`, `#fff`, `#000`, `#333`, `#eee`, `#888`.

| Literal | Token |
| --- | --- |
| `#fff`, `#ffffff` | `surface` (backgrounds) or `on-accent` (text on fills) |
| `#ccc`, `#cccccc`, `#ddd` | `border-strong` |
| `#eee`, `#e6e6e6`, `#e0e0e0` | `border` |
| `#f1f1f1`, `#f2f2f2`, `#f6f6f6`, `#fafafa` | `surface-muted` |
| `#000`, `#111`, `#333` | `text` |
| `#444`, `#4d4d4d`, `#666` | `text-muted` |
| `#888`, `#999`, `#aaa`, `#808080` | `text-subtle` |
| `#f00`, `#ff0000`, `#c00`, `#900`, `#e30000` | `danger` |
| `#0070c9`, `#0055b7`, `#1274e0`, `#4a90e2`, `#2f90fb` | `accent` / `accent-hover` |

## Requirements
- One component per commit, starting with Card, Field, Toggle, TextField, Dialog, Dropdown, Select.
- Check each in the styleguide in light, dark and a non-default accent, at desktop and mobile width.

## Acceptance
- No hex literals outside the token files.
