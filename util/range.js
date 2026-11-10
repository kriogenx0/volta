// A list of numbers, counting from `start` up to but not including `end`.
//
//   range(4)        // => [0, 1, 2, 3]
//   range(1, 5)     // => [1, 2, 3, 4]
//   range(0, 60, 15) // => [0, 15, 30, 45]
//   range(5, 0)     // => [5, 4, 3, 2, 1]   (counts down when end is lower)
//   range(1, 4, 0)  // => [1, 1, 1]
export const range = (start, end, step) => {
  let from = start;
  let to = end;
  if (to === undefined) {
    to = from;
    from = 0;
  }
  const by = step === undefined ? (from < to ? 1 : -1) : step;
  const length = by === 0 ? Math.max(Math.ceil(Math.abs(to - from)), 0) : Math.max(Math.ceil((to - from) / by), 0);
  return Array.from({ length }, (_, i) => from + i * by);
};

export default range;
