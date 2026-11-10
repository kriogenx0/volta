// A function that waits until `wait` ms have passed with no new call, then runs once
// with the last call's arguments (a search box: search when the typing stops).
// `.cancel()` drops a pending call; `.flush()` runs it now.
//
//   const search = debounce((text) => fetchResults(text), 200);
//   input.addEventListener('input', (e) => search(e.target.value));
export const debounce = (fn, wait = 0) => {
  let timer = null;
  let pending = null; // { args, self }

  const run = () => {
    const { args, self } = pending;
    pending = null;
    timer = null;
    return fn.apply(self, args);
  };

  function debounced(...args) {
    pending = { args, self: this };
    clearTimeout(timer);
    timer = setTimeout(run, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
    pending = null;
  };

  debounced.flush = () => {
    if (!pending) return undefined;
    clearTimeout(timer);
    return run();
  };

  return debounced;
};

export default debounce;
