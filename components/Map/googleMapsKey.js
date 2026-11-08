// The Google Maps API key, set once by the app at startup with
// setGoogleMapsKey(). The library has no default: a key in the source is public
// to everyone who reads the repo or the bundle, and each app should use its
// own, restricted to its own domains in the Google Cloud console. Without one,
// Map and MapSelector show a message instead of loading Google's script.

let apiKey = null;

export const setGoogleMapsKey = (key) => {
  apiKey = typeof key === 'string' && key.trim() !== '' ? key.trim() : null;
};

export const getGoogleMapsKey = () => apiKey;
