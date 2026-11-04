---
priority: p3
depends_on: [replace-hex-literals-in-component-scss]
---

# Add a stylelint rule against hex colours

Add stylelint with `color-no-hex` so new literals fail lint. Adding stylelint is new tooling, so confirm with the user first; wire it into `make lint` and CI.
