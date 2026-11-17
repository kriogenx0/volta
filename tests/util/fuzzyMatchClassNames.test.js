import fuzzyMatch from '../../util/fuzzyMatch';
import classNames from '../../util/classNames';

describe('fuzzyMatch', () => {
  it('matches characters in order, ignoring case', () => {
    expect(fuzzyMatch('abc', 'A big cat')).toBe(true);
    expect(fuzzyMatch('ABC', 'a-b-c')).toBe(true);
  });
  it('fails when a character is missing or out of order', () => {
    expect(fuzzyMatch('acb', 'abc')).toBe(false);
    expect(fuzzyMatch('z', 'abc')).toBe(false);
    expect(fuzzyMatch('aa', 'a')).toBe(false);
  });
  it('matches everything for an empty pattern', () => {
    expect(fuzzyMatch('', 'anything')).toBe(true);
    expect(fuzzyMatch(undefined, '')).toBe(true);
  });
});

describe('classNames', () => {
  it('joins strings and skips falsy values', () => {
    expect(classNames('a', undefined, null, false, '', 'b')).toBe('a b');
  });
  it('keeps the keys of an object whose value is truthy', () => {
    expect(classNames('a', { b: true, c: false, d: 1 })).toBe('a b d');
    expect(classNames({ [undefined]: undefined })).toBe('');
  });
  it('flattens arrays', () => {
    expect(classNames(['a', ['b', { c: true }]], 'd')).toBe('a b c d');
  });
});
