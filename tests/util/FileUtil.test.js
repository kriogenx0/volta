import FileUtil from '../../util/FileUtil';

describe('FileUtil.size', () => {
  it.each([
    [0, '0 B'],
    [1, '1 B'],
    [999, '999 B'],
    [1000, '1 kB'],
    [1500, '1.5 kB'],
    [1234567, '1.23 MB'],
    [2000000, '2 MB'],
    [5e9, '5 GB'],
    [1e12, '1 TB'],
    [-1500, '-1.5 kB']
  ])('writes %p as %p', (bytes, text) => {
    expect(FileUtil.size(bytes)).toBe(text);
  });

  it('uses decimal units: 1000 bytes in a kilobyte, not 1024', () => {
    expect(FileUtil.size(1024)).toBe('1.02 kB');
  });

  it('keeps at most two decimals and no trailing zeros', () => {
    expect(FileUtil.size(1049)).toBe('1.05 kB');
    expect(FileUtil.size(1100)).toBe('1.1 kB');
    expect(FileUtil.size(1004)).toBe('1 kB');
  });

  it('rounds a value that reaches 1000 up to the next unit', () => {
    expect(FileUtil.size(999999)).toBe('1 MB');
    expect(FileUtil.size(999994)).toBe('999.99 kB');
    expect(FileUtil.size(999999999)).toBe('1 GB');
  });

  it('rounds fractional bytes to a whole byte', () => {
    expect(FileUtil.size(0.4)).toBe('0 B');
    expect(FileUtil.size(12.6)).toBe('13 B');
  });

  it('accepts a number given as text', () => {
    expect(FileUtil.size('1500')).toBe('1.5 kB');
  });

  it('gives an empty string for anything that is not a number', () => {
    [undefined, null, '', 'abc', NaN, Infinity, {}].forEach((value) => {
      expect(FileUtil.size(value)).toBe('');
    });
  });

  it('stops at the largest unit', () => {
    expect(FileUtil.size(1e30)).toBe('1000000 YB');
  });
});

describe('FileUtil paths', () => {
  it('joins a path array with slashes', () => {
    expect(FileUtil.joinPath(['a', 'b', 'c'])).toBe('a/b/c');
  });

  it('tells folders (a trailing slash) from files', () => {
    expect(FileUtil.isDirectory('photos/')).toBe(true);
    expect(FileUtil.isDirectory('photo.png')).toBe(false);
  });

  it('strips the trailing slash from a folder only', () => {
    expect(FileUtil.stripTrailingSlash('photos/')).toBe('photos');
    expect(FileUtil.stripTrailingSlash('photo.png')).toBe('photo.png');
  });

  it('takes the file name from a path with either kind of slash', () => {
    expect(FileUtil.fileNameFromPath('a/b/c.txt')).toBe('c.txt');
    expect(FileUtil.fileNameFromPath('a\\b\\c.txt')).toBe('c.txt');
  });

  it('takes the top-level type from a mime type', () => {
    expect(FileUtil.mimeTypeToType('image/png')).toBe('image');
  });
});
