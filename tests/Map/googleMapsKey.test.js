import { setGoogleMapsKey, getGoogleMapsKey } from '../../components/Map/googleMapsKey';
import * as library from '../../components';

describe('the Google Maps key', () => {
  afterEach(() => setGoogleMapsKey(null));

  it('has no default: the library ships without a key', () => {
    expect(getGoogleMapsKey()).toBeNull();
  });

  it('is set once by the app and read back', () => {
    setGoogleMapsKey('my-key');
    expect(getGoogleMapsKey()).toBe('my-key');
  });

  it('trims the key', () => {
    setGoogleMapsKey('  my-key \n');
    expect(getGoogleMapsKey()).toBe('my-key');
  });

  it.each([[''], ['   '], [undefined], [null], [42], [{}]])('treats %p as no key', (value) => {
    setGoogleMapsKey('my-key');
    setGoogleMapsKey(value);
    expect(getGoogleMapsKey()).toBeNull();
  });

  it('is exported from the library, so an app can set it at startup', () => {
    expect(library.setGoogleMapsKey).toBe(setGoogleMapsKey);
    expect(library.getGoogleMapsKey).toBe(getGoogleMapsKey);
  });
});

describe('the source', () => {
  // A key in the source is public to everyone who reads the repo or the bundle.
  it('contains no Google API key', () => {
    const fs = require('fs');
    const path = require('path');
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return entry.name === 'compiled' ? [] : walk(full);
      return /\.(jsx?|scss)$/.test(entry.name) ? [full] : [];
    });
    const offenders = walk(path.join(__dirname, '..', '..', 'components'))
      .filter((file) => /AIza[0-9A-Za-z_-]{20,}/.test(fs.readFileSync(file, 'utf8')))
      .map((file) => path.relative(path.join(__dirname, '..', '..'), file));
    expect(offenders).toEqual([]);
  });
});
