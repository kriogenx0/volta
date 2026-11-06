import { useEffect } from 'react';

// Keeps the page behind a modal overlay from scrolling.
//
// Locks are counted, so two overlays open at once keep the page locked until the
// last one closes. The first lock hides the body's overflow and adds the width of
// the scrollbar that disappears as padding, so the page doesn't jump sideways;
// the last unlock puts back whatever inline overflow and padding the body had.
//
// Limits: this is `overflow: hidden` on <body>. iOS Safari can still scroll the
// page behind with a touch drag, and `position: fixed` elements outside <body>'s
// flow shift by the scrollbar's width.

let locks = 0;
let saved = null;

const lock = () => {
  locks += 1;
  if (locks > 1) return;

  const { body, documentElement: html } = document;
  saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };

  // clientWidth is 0 where there is no layout (tests), and the gap is 0 with overlay scrollbars.
  const scrollbar = html.clientWidth ? window.innerWidth - html.clientWidth : 0;
  if (scrollbar > 0) {
    const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${padding + scrollbar}px`;
  }
  body.style.overflow = 'hidden';
};

const unlock = () => {
  locks = Math.max(0, locks - 1);
  if (locks > 0 || !saved) return;

  document.body.style.overflow = saved.overflow;
  document.body.style.paddingRight = saved.paddingRight;
  saved = null;
};

const useScrollLock = (active = true) => {
  useEffect(() => {
    if (!active) return undefined;
    lock();
    return unlock;
  }, [active]);
};

export default useScrollLock;
