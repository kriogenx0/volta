import { each, map } from '../../util/collection';
import debounce from '../../util/debounce';
import isEqual from '../../util/isEqual';
import range from '../../util/range';

describe('map', () => {
  it('maps an array with the value, index and array', () => {
    const list = ['a', 'b'];
    expect(map(list, (v, i, all) => [v, i, all === list])).toEqual([['a', 0, true], ['b', 1, true]]);
  });

  it('maps an object with the value and key', () => {
    expect(map({ home: 'Home', about: 'About' }, (label, key) => `${key}:${label}`)).toEqual(['home:Home', 'about:About']);
  });

  it('maps an array-like, such as a FileList', () => {
    const files = { 0: 'x', 1: 'y', length: 2 };
    expect(map(files, (f, i) => `${i}${f}`)).toEqual(['0x', '1y']);
  });

  it('maps nothing to an empty list', () => {
    expect(map(undefined, () => 1)).toEqual([]);
    expect(map(null, () => 1)).toEqual([]);
    expect(map([], () => 1)).toEqual([]);
    expect(map({}, () => 1)).toEqual([]);
  });

  it('does not skip the holes in a sparse array', () => {
    expect(map([1, , 3], (v) => v)).toEqual([1, undefined, 3]); // eslint-disable-line no-sparse-arrays
  });

  it('maps a string by character', () => {
    expect(map('ab', (c) => c.toUpperCase())).toEqual(['A', 'B']);
  });

  it('treats an object with a non-numeric length as an object', () => {
    expect(map({ length: 'tall', width: 2 }, (v, k) => k)).toEqual(['length', 'width']);
  });
});

describe('each', () => {
  it('visits arrays and objects, and returns the collection', () => {
    const seen = [];
    const obj = { a: 1, b: 2 };
    expect(each(obj, (v, k) => { seen.push([k, v]); })).toBe(obj);
    each([5, 6], (v, i) => { seen.push([i, v]); });
    expect(seen).toEqual([['a', 1], ['b', 2], [0, 5], [1, 6]]);
  });

  it('stops when the callback returns false, and only for false', () => {
    const seen = [];
    each([1, 2, 3], (v) => { seen.push(v); return v === 2 ? false : undefined; });
    expect(seen).toEqual([1, 2]);
    const all = [];
    each([1, 2, 3], (v) => { all.push(v); return 0; });
    expect(all).toEqual([1, 2, 3]);
  });

  it('does nothing for nothing', () => {
    const fn = jest.fn();
    expect(each(undefined, fn)).toBeUndefined();
    expect(each(null, fn)).toBeNull();
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('range', () => {
  it('counts up to but not including the end', () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 24)).toHaveLength(24);
    expect(range(1, 13)[0]).toBe(1);
    expect(range(1, 13)[11]).toBe(12);
  });

  it('takes a step, and rounds a partial last step up', () => {
    expect(range(0, 60, 15)).toEqual([0, 15, 30, 45]);
    expect(range(0, 10, 4)).toEqual([0, 4, 8]);
    expect(range(0, 60, 5)).toHaveLength(12);
  });

  it('counts down when the end is lower, or the step is negative', () => {
    expect(range(5, 0)).toEqual([5, 4, 3, 2, 1]);
    expect(range(0, -3)).toEqual([0, -1, -2]);
    expect(range(10, 0, -5)).toEqual([10, 5]);
  });

  it('is empty when the step goes the wrong way, and repeats for a step of 0', () => {
    expect(range(0)).toEqual([]);
    expect(range(3, 1, 1)).toEqual([]);
    expect(range(1, 4, 0)).toEqual([1, 1, 1]);
  });
});

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('runs once, after the calls stop, with the last arguments', () => {
    const fn = jest.fn();
    const d = debounce(fn, 200);
    d('a'); d('b');
    jest.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();
    d('c');
    jest.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('can run again after it has run', () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);
    d(1); jest.advanceTimersByTime(50);
    d(2); jest.advanceTimersByTime(50);
    expect(fn.mock.calls).toEqual([[1], [2]]);
  });

  it('cancel drops a pending call', () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);
    d(); d.cancel();
    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('flush runs a pending call now, once, and does nothing when none is pending', () => {
    const fn = jest.fn(() => 'done');
    const d = debounce(fn, 50);
    expect(d.flush()).toBeUndefined();
    d('x');
    expect(d.flush()).toBe('done');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('keeps the this of the last call', () => {
    const seen = [];
    const obj = { d: debounce(function remember() { seen.push(this); }, 10) };
    obj.d();
    jest.advanceTimersByTime(10);
    expect(seen).toEqual([obj]);
  });
});

describe('isEqual', () => {
  it('compares primitives, with NaN equal to NaN', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('a', 'a')).toBe(true);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(1, '1')).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(0, null)).toBe(false);
  });

  it('compares arrays and objects deeply', () => {
    expect(isEqual([1, [2, { a: 3 }]], [1, [2, { a: 3 }]])).toBe(true);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
    expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    expect(isEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  it('compares dates and regular expressions by value', () => {
    expect(isEqual(new Date(5), new Date(5))).toBe(true);
    expect(isEqual(new Date(5), new Date(6))).toBe(false);
    expect(isEqual(/a/g, /a/g)).toBe(true);
    expect(isEqual(/a/g, /a/i)).toBe(false);
  });

  it('never calls an array equal to an object of the same keys', () => {
    expect(isEqual([], {})).toBe(false);
    expect(isEqual({ 0: 'a', length: 1 }, ['a'])).toBe(false);
  });

  it('copes with a value that contains itself', () => {
    const a = { name: 'a' }; a.self = a;
    const b = { name: 'a' }; b.self = b;
    expect(isEqual(a, b)).toBe(true);
    const c = { name: 'c' }; c.self = c;
    expect(isEqual(a, c)).toBe(false);
  });

  it('compares the plain arrays MultiSelect keeps its value in', () => {
    expect(isEqual([{ value: 1, label: 'A' }], [{ value: 1, label: 'A' }])).toBe(true);
    expect(isEqual([{ value: 1, label: 'A' }], [{ value: 2, label: 'A' }])).toBe(false);
  });
});
