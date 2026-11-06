import { useEffect } from 'react';

// Keeps keyboard focus inside a modal overlay while it is `active`.
//
// - On opening, focus moves to the first focusable element inside (or to the
//   container itself, if there is none and it can take focus), unless something
//   inside already has it.
// - Tab and Shift+Tab wrap around at the ends, and pull focus back in if it
//   somehow got outside.
// - On closing, focus returns to what had it before, unless the user has already
//   moved it somewhere else.
//
// Traps are stacked: with two overlays open, only the top one handles Tab, so
// the one underneath doesn't pull focus out of the one on top.

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[tabindex]'
].join(',');

const focusables = (container) => [...container.querySelectorAll(FOCUSABLE)].filter(
  (element) => element.tabIndex >= 0 && !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true'
);

const stack = [];

const useFocusTrap = (containerRef, active = true) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return undefined;

    const previous = document.activeElement;
    const entry = { container };
    stack.push(entry);

    // The fallback target when nothing inside can take focus.
    if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');

    if (!container.contains(document.activeElement)) {
      const [first] = focusables(container);
      (first || container).focus();
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab' || stack[stack.length - 1] !== entry) return;

      const items = focusables(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (!container.contains(current)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (current === first || current === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      stack.splice(stack.indexOf(entry), 1);

      // Focus left behind in the overlay (or lost when it unmounted) goes back
      // to where it was; focus the user has put elsewhere stays there.
      const current = document.activeElement;
      const lost = !current || current === document.body || container.contains(current);
      if (lost && previous && previous.isConnected && typeof previous.focus === 'function') previous.focus();
    };
  }, [active, containerRef]);
};

export default useFocusTrap;
