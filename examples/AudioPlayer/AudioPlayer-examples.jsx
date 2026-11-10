import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';

// A short tune built here as a WAV data URI, so the player has something to
// play without a network or an audio file in the repo.
const makeTune = () => {
  const rate = 8000;
  const notes = [262, 294, 330, 392, 330, 294, 262, 196];
  const noteLength = rate * 3 / 2;
  const samples = noteLength * notes.length;
  const bytes = new Uint8Array(44 + samples);
  const view = new DataView(bytes.buffer);
  const write = (offset, text) => [...text].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));

  // WAV header: 8-bit mono PCM
  write(0, 'RIFF');
  view.setUint32(4, 36 + samples, true);
  write(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  write(36, 'data');
  view.setUint32(40, samples, true);

  for (let i = 0; i < samples; i++) {
    const inNote = i % noteLength;
    const fade = Math.min(1, inNote / 400, (noteLength - inNote) / 400);
    const frequency = notes[Math.floor(i / noteLength)];
    bytes[44 + i] = 128 + Math.round(40 * fade * Math.sin(2 * Math.PI * frequency * i / rate));
  }

  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return `data:audio/wav;base64,${btoa(binary)}`;
};

// Bars standing in for a track's waveform image
const makeWaveform = () => {
  const bars = Array.from({ length: 60 }, (_, i) => {
    const height = 6 + Math.round(34 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)));
    return `<rect x="${i * 2}" y="${25 - height / 2}" width="1" height="${height}" fill="#888"/>`;
  }).join('');
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" preserveAspectRatio="none">${bars}</svg>`)}`;
};

const TUNE = makeTune();
const WAVEFORM = makeWaveform();

export default {
  name: 'AudioPlayer',
  description: 'A compact player for one audio file: play or pause, the time played, a bar to click, drag or arrow-key through, and the length. It loads the file when it mounts and shows an error if it cannot. Add volume for a mute button; autoplay starts it on load, though browsers often block that until the page has been clicked.',
  examples: [
    {
      name: 'Player',
      code: '<AudioPlayer src={tuneUrl} />',
      output: <AudioPlayer src={TUNE} />
    },
    {
      name: 'With a mute button',
      code: '<AudioPlayer src={tuneUrl} volume={0.5} />',
      output: <AudioPlayer src={TUNE} volume={0.5} />
    },
    {
      name: 'Looping',
      code: '<AudioPlayer src={tuneUrl} loop volume />',
      output: <AudioPlayer src={TUNE} loop volume />
    },
    {
      name: 'With a waveform',
      code: '<AudioPlayer src={tuneUrl} waveform={waveformUrl} />',
      output: <AudioPlayer src={TUNE} waveform={WAVEFORM} />
    },
    {
      name: 'File that cannot load',
      code: '<AudioPlayer src="/audio/missing.mp3" />',
      output: <AudioPlayer src="/audio/missing.mp3" />
    }
  ]
};
