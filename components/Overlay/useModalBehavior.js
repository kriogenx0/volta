import useFocusTrap from './useFocusTrap';
import useScrollLock from './useScrollLock';

// What makes an overlay modal: while `active`, the page behind it doesn't scroll
// and keyboard focus stays inside `containerRef` and returns afterwards. Escape
// is separate (useEscapeKey), since overlays differ in whether and how they close.
const useModalBehavior = (containerRef, active = true) => {
  useScrollLock(active);
  useFocusTrap(containerRef, active);
};

export default useModalBehavior;
