---
priority: p3
branch: backlog/add-styleguide-smoke-test
---

# Add visual regression for the styleguide, in light and dark

The task asked for visual regression "or at least a smoke test". The smoke test is done on the branch above (`tests/styleguideSmoke.test.jsx`, see `docs/features/styleguide.md`): the whole styleguide renders in light and dark, every page and every component opens with all of its examples, no example falls back to the "Couldn't render" box, and nothing logs an error. It also found five names in the sidebar groups that matched no component.

It cannot see how anything looks: jsdom draws nothing.

## Blocked

Visual regression, comparing screenshots of every page and component in light and dark against saved ones, needs two things that aren't here and aren't mine to add:

- **A real browser driven by a test tool.** There is none in the repository, and none on the machine this was written on. The usual choice is Playwright (browsers it downloads, plus `@playwright/test`), which `conventions.md` calls new infrastructure ("no new services, runtimes, or tooling the project doesn't already use"), so it needs your go-ahead.
- **A place for the reference screenshots, and a way to update them.** Either committed to the repository (large and noisy diffs, and font rendering differs between machines, so CI and a laptop disagree) or stored by a service (an account, and possibly a cost).

Decide whether to add it, and where the screenshots live.

If yes, the plan: a Playwright test that opens the styleguide's dev server (`make up` runs it in a container, so run the tests against that for the same fonts as CI), visits each page and each component in light and dark (the `data-theme` attribute, or the header's Auto / Light / Dark control), and compares screenshots with a small tolerance. Add a CI job after the existing ones in `.github/workflows/test.yml`, and a `make` target.

To finish: record the decision here, or delete this file if it is not wanted.
