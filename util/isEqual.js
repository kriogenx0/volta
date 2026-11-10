// Whether two values are the same all the way down: primitives by value (NaN equals
// NaN), arrays item by item, plain objects key by key, dates by time and regular
// expressions by pattern. Objects of different kinds are never equal, and other
// objects (Maps, Sets, class instances) are compared by their own keys.
export const isEqual = (a, b, seen = new WeakMap()) => {
  if (a === b || (a !== a && b !== b)) return true; // eslint-disable-line no-self-compare
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp) return String(a) === String(b);

  // A loop back to something already being compared counts as equal
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (Array.isArray(a)) {
    return a.length === b.length && a.every((item, i) => isEqual(item, b[i], seen));
  }

  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length
    && keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key], seen));
};

export default isEqual;
