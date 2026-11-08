---
priority: p3
branch: backlog/write-design-system-component-guidelines
---

# Write guidelines for the remaining components

Write guidelines for the remaining ~88 components (`components/<Name>/README.md` in the design-system artifact).

## Done on the branch

Every component that `components/index.js` exports (89 directories) has a `components/<Directory>/README.md`, written from the code and checked by `tests/componentReadmes.test.js` (see [docs/features/component_guidelines.md](../features/component_guidelines.md)).

## Blocked

Putting the READMEs into the design-system artifact (https://claude.ai/artifact/NvqB2qq26do7JhME6sBdDY) needs the artifact's account and network access, which this environment does not have. What is left: copy each `components/<Directory>/README.md` to the artifact's `components/<Directory>/README.md`, and re-copy when a component's props change (the test fails when a README stops matching its propTypes, so this repo's READMEs are the source).

## Unverified

The Do and don't advice in each README is drawn from `docs/project/design-system.md` and the component's code; nobody has reviewed it as product guidance.
