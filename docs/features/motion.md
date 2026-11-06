# Motion

How fast things move, and what happens when the user asks for less motion.

## What it does for users

- **One speed for transitions.** Every transition in the library takes its duration from `--v-anim-speed` (150ms by default), usually through the Sass alias `$anim-speed-normal`. An app changes it for everything with `Theme.setAnimationSpeed(300)` or `Theme.setAnimationSpeed('0.3s')`; `Theme.resetAnimationSpeed()` puts it back.
- **The OS "reduce motion" setting is honoured.** With `prefers-reduced-motion: reduce`, `styles/_colors.scss` sets `--v-anim-speed` to `0.01ms`, so every transition, and the toast's enter and leave, becomes all but instant. (Near zero, not zero: `ToastMessage` dismisses on `animationend`, which still fires.)
- **An explicit choice wins.** `Theme.setAnimationSpeed()` sets the variable on `<html>`, which beats the stylesheet, so an app that sets its own speed keeps it even with the OS setting on.
- **Looping progress indicators keep moving**, because moving is what they are for: the `Loader` variants and the ring that turns while `ImagePicker` reads a file. `ProgressBar`'s indeterminate animations fade in place instead of travelling under reduce motion (it has its own rule).

## What is checked

`tests/reducedMotion.test.js`:

- the compiled `_colors.scss` has the reduce-motion rule, and it sets the speed to more than zero and no more than 1ms;
- no `transition` or `transition-duration` in the SCSS of `components/`, `styles/`, `styleguide/` and `examples/` has a literal duration (`0s`, the way a transition is switched off, is allowed);
- an animation with a literal duration (a keyframe loop) is in a file that reacts to `prefers-reduced-motion`, or is a listed progress indicator with a reason.

Putting a literal transition back, or removing the reduce-motion rule, fails it.

## Easing

`--v-anim-ease` (`ease-in-out`) is used wherever a transition has an easing. Three declarations spell one out on purpose: two `0s` hacks that stop the browser's autofill background flashing, and `Drawer`'s `visibility 0s linear var(--v-anim-speed)`, which has to be `linear` so the panel stays visible while it slides closed.

## Changed with this

Seven transitions had their own durations and now use the variable: `styles/type.scss` (100ms), `styles/components/forms.scss` (200ms, three of them), `layout.scss` and `tables.scss` (150ms), and two in the styleguide (100ms and 120ms). The ones that were 100, 120 and 200ms are now 150ms, the library's standard.

## Known limits

- Under reduce motion the transitions are instant, but nothing slows or stops the `Loader` variants; they are progress indicators, and a user who wants them still can't turn them off.
- `Theme.getAnimationSpeed()` reads the computed value, so under reduce motion it reports `0.01ms`.
- The styleguide's animation speed slider starts at 150 whatever the OS setting is.

## History

- 2026-11-06 (branch `backlog/respect-reduced-motion`, not merged or deployed): the reduce-motion rule, the seven transitions, the test.
- Not verified: the OS setting on a real system. Chrome and Safari can emulate it in their developer tools; see the task file.
