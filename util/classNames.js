// Joins class names: strings are kept, an object keeps the keys whose value is
// truthy, and anything falsy is skipped. Covers what `classnames` did here.
const classNames = (...args) => args
  .flatMap((arg) => {
    if (!arg) return [];
    if (typeof arg === 'string') return [arg];
    if (Array.isArray(arg)) return [classNames(...arg)];
    if (typeof arg === 'object') return Object.keys(arg).filter((key) => arg[key]);
    return [];
  })
  .filter(Boolean)
  .join(' ');

export default classNames;
