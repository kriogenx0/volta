// map and each for whatever a component is handed to loop over: an array, an
// array-like (a FileList), a plain object ({ key: value }), or nothing at all. The
// callback gets (value, indexOrKey, collection), as with Array methods.
//
//   map({ home: 'Home', about: 'About' }, (label, key) => <Tab key={key}>{label}</Tab>)
//   map(undefined, fn) // => []
//
// Use the Array methods when the value is surely an array; use these when it might
// not be.

const isArrayLike = (collection) => (
  typeof collection !== 'function' && Number.isInteger(collection.length) && collection.length >= 0
);

// Calls fn for each item; stops early if fn returns false. Returns the collection.
export const each = (collection, fn) => {
  if (collection == null) return collection;

  if (isArrayLike(collection)) {
    for (let i = 0; i < collection.length; i += 1) {
      if (fn(collection[i], i, collection) === false) break;
    }
  } else {
    const keys = Object.keys(collection);
    for (let i = 0; i < keys.length; i += 1) {
      if (fn(collection[keys[i]], keys[i], collection) === false) break;
    }
  }
  return collection;
};

// An array of what fn returns for each item (empty for nothing). Unlike
// Array#map it does not skip the holes in a sparse array.
export const map = (collection, fn) => {
  const out = [];
  each(collection, (value, key, all) => { out.push(fn(value, key, all)); });
  return out;
};

export default { each, map };
