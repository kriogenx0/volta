import { render, screen, fireEvent, act } from '@testing-library/react';

import AudioPlayer, { formatTime } from '../../components/AudioPlayer/AudioPlayer';
import examples from '../../examples/AudioPlayer/AudioPlayer-examples';

// A stand-in for Howler's Howl: it records what the component asks for and lets
// each test fire the callbacks the real player would (load, play, end, ...).
const mockHowls = [];

jest.mock('howler', () => ({
  Howl: class MockHowl {
    constructor(options) {
      this.options = options;
      this.time = 0;
      this.length = 125;
      this.muted = false;
      this.unloaded = false;
      this.play = jest.fn(() => { this.options.onplay(); });
      this.pause = jest.fn(() => { this.options.onpause(); });
      this.mute = jest.fn((value) => { this.muted = value; });
      this.unload = jest.fn(() => { this.unloaded = true; });
      mockHowls.push(this);
    }

    seek(value) {
      if (value === undefined) return this.time;
      this.time = value;
      return this;
    }

    duration() {
      return this.length;
    }
  }
}));

const lastHowl = () => mockHowls[mockHowls.length - 1];
const loaded = () => act(() => { lastHowl().options.onload(); });
const loadedTrack = (props = {}) => {
  const view = render(<AudioPlayer src="/song.mp3" {...props} />);
  loaded();
  return view;
};
// jsdom has no PointerEvent, so send a mouse event under the pointer event's name;
// React reads the same clientX and button from it
const pointer = (type, target, clientX) => fireEvent(
  target,
  new MouseEvent(type, { bubbles: true, cancelable: true, clientX })
);
// Fake getBoundingClientRect: the seek bar spans x = 100 to 300
const sizeRail = (rail) => {
  rail.getBoundingClientRect = () => ({ left: 100, width: 200, top: 0, height: 50, right: 300, bottom: 50 });
};

beforeEach(() => {
  mockHowls.length = 0;
});

describe('formatTime', () => {
  it.each([
    [0, '0:00'],
    [5, '0:05'],
    [59, '0:59'],
    [60, '1:00'],
    [125, '2:05'],
    [3600, '60:00'],
    [4.4, '0:04'],
    [59.6, '1:00'],
    [undefined, '0:00'],
    [NaN, '0:00']
  ])('shows %s seconds as %s', (secs, text) => {
    expect(formatTime(secs)).toBe(text);
  });
});

describe('AudioPlayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<AudioPlayer src="/song.mp3" />);
    expect(container).toBeInTheDocument();
  });

  describe('loading the file', () => {
    it('asks the player for the file, with the options it was given', () => {
      render(<AudioPlayer src="/song.mp3" autoplay loop volume={0.4} />);
      expect(lastHowl().options).toMatchObject({ src: ['/song.mp3'], autoplay: true, loop: true, volume: 0.4 });
    });

    it('is quiet, not looping and full volume by default', () => {
      render(<AudioPlayer src="/song.mp3" />);
      expect(lastHowl().options).toMatchObject({ autoplay: false, loop: false, volume: 1 });
    });

    it('keeps the starting volume between 0 and 1, and full for true or false', () => {
      render(<AudioPlayer src="/a.mp3" volume={3} />);
      expect(lastHowl().options.volume).toBe(1);
      render(<AudioPlayer src="/b.mp3" volume={-1} />);
      expect(lastHowl().options.volume).toBe(0);
      render(<AudioPlayer src="/c.mp3" volume />);
      expect(lastHowl().options.volume).toBe(1);
    });

    it('shows a loader until the file has loaded, then the controls', () => {
      const { container } = render(<AudioPlayer src="/song.mp3" />);
      expect(container.querySelector('.volta-loader')).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
      expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();

      loaded();
      expect(container.querySelector('.volta-loader')).toBeNull();
      expect(container.firstChild).not.toHaveAttribute('aria-busy');
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });

    it('shows the time played and the length', () => {
      const { container } = loadedTrack();
      expect(container.querySelector('.time')).toHaveTextContent('0:00');
      expect(container.querySelector('.duration')).toHaveTextContent('2:05');
    });

    it('shows an error when the file cannot be loaded', () => {
      render(<AudioPlayer src="/missing.mp3" />);
      act(() => { lastHowl().options.onloaderror(); });
      expect(screen.getByRole('alert')).toHaveTextContent('Could not load audio file');
      expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
    });

    it('shows the error rather than throwing when there is no file', () => {
      render(<AudioPlayer />);
      expect(screen.getByRole('alert')).toHaveTextContent('Could not load audio file');
      expect(mockHowls).toHaveLength(0);
    });

    it('loads a new file when src changes and drops the old one', () => {
      const { rerender } = loadedTrack();
      const first = lastHowl();
      rerender(<AudioPlayer src="/other.mp3" />);
      expect(first.unload).toHaveBeenCalledTimes(1);
      expect(lastHowl().options.src).toEqual(['/other.mp3']);
      expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
      loaded();
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });

    it('ignores a late answer from a file that was replaced or removed', () => {
      const { rerender, unmount } = render(<AudioPlayer src="/song.mp3" />);
      const first = lastHowl();
      rerender(<AudioPlayer src="/other.mp3" />);
      act(() => { first.options.onload(); });
      expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
      unmount();
      expect(() => first.options.onloaderror()).not.toThrow();
    });

    it('releases the player when removed', () => {
      const { unmount } = loadedTrack();
      unmount();
      expect(lastHowl().unload).toHaveBeenCalledTimes(1);
    });

    it('does not use the deprecated componentWillMount', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<AudioPlayer src="/song.mp3" />);
      const messages = [...warn.mock.calls, ...error.mock.calls].map((args) => String(args[0]));
      expect(messages.filter((message) => message.includes('componentWillMount'))).toEqual([]);
      warn.mockRestore();
      error.mockRestore();
    });
  });

  describe('playing', () => {
    it('plays and pauses from the same button, which says which', () => {
      loadedTrack();
      fireEvent.click(screen.getByRole('button', { name: 'Play' }));
      expect(lastHowl().play).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
      expect(lastHowl().pause).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });

    it('shows pause when the player starts by itself, as with autoplay', () => {
      loadedTrack({ autoplay: true });
      act(() => { lastHowl().options.onplay(); });
      expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    });

    it('moves the time and the bar along while playing', () => {
      jest.useFakeTimers();
      try {
        const { container } = loadedTrack();
        fireEvent.click(screen.getByRole('button', { name: 'Play' }));
        lastHowl().time = 31.25;
        act(() => { jest.advanceTimersByTime(40); });
        expect(container.querySelector('.time')).toHaveTextContent('0:31');
        expect(container.querySelector('.rail-elapsed_percent')).toHaveStyle({ width: '25%' });
      } finally {
        jest.useRealTimers();
      }
    });

    it('stops following the playhead once paused', () => {
      jest.useFakeTimers();
      try {
        const { container } = loadedTrack();
        fireEvent.click(screen.getByRole('button', { name: 'Play' }));
        fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
        lastHowl().time = 60;
        act(() => { jest.advanceTimersByTime(100); });
        expect(container.querySelector('.time')).toHaveTextContent('0:00');
      } finally {
        jest.useRealTimers();
      }
    });

    it('goes back to the start when it plays to the end', () => {
      jest.useFakeTimers();
      try {
        const { container } = loadedTrack();
        fireEvent.click(screen.getByRole('button', { name: 'Play' }));
        lastHowl().time = 125;
        act(() => { jest.advanceTimersByTime(40); });
        act(() => { lastHowl().options.onend(); });
        expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
        expect(container.querySelector('.time')).toHaveTextContent('0:00');
      } finally {
        jest.useRealTimers();
      }
    });

    it('keeps playing when a looping track reaches the end', () => {
      loadedTrack({ loop: true });
      fireEvent.click(screen.getByRole('button', { name: 'Play' }));
      act(() => { lastHowl().options.onend(); });
      expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    });
  });

  describe('seeking', () => {
    it('is a slider with the time as its value', () => {
      loadedTrack();
      const slider = screen.getByRole('slider', { name: 'Seek' });
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '125');
      expect(slider).toHaveAttribute('aria-valuenow', '0');
      expect(slider).toHaveAttribute('aria-valuetext', '0:00 of 2:05');
    });

    it('jumps to the point clicked on the bar, playing or not', () => {
      const { container } = loadedTrack();
      const rail = screen.getByRole('slider', { name: 'Seek' });
      sizeRail(rail);
      pointer('pointerdown', rail, 200);
      expect(lastHowl().time).toBe(62.5);
      expect(container.querySelector('.time')).toHaveTextContent('1:03');
      expect(container.querySelector('.rail-elapsed_percent')).toHaveStyle({ width: '50%' });
      expect(rail).toHaveAttribute('aria-valuetext', '1:03 of 2:05');
    });

    it('follows the pointer while it is held down, even past the ends of the bar', () => {
      loadedTrack();
      const rail = screen.getByRole('slider', { name: 'Seek' });
      sizeRail(rail);
      pointer('pointerdown', rail, 100);
      pointer('pointermove', rail, 150);
      expect(lastHowl().time).toBe(31.25);
      pointer('pointermove', rail, 900);
      expect(lastHowl().time).toBe(125);
      pointer('pointermove', rail, -50);
      expect(lastHowl().time).toBe(0);

      pointer('pointerup', rail, 0);
      pointer('pointermove', rail, 200);
      expect(lastHowl().time).toBe(0);
    });

    it('ignores the pointer moving over the bar without being pressed', () => {
      loadedTrack();
      const rail = screen.getByRole('slider', { name: 'Seek' });
      sizeRail(rail);
      pointer('pointermove', rail, 200);
      expect(lastHowl().time).toBe(0);
    });

    it('moves by 5 seconds with the arrow keys and to the ends with Home and End', () => {
      loadedTrack();
      const rail = screen.getByRole('slider', { name: 'Seek' });
      fireEvent.keyDown(rail, { key: 'ArrowRight' });
      expect(lastHowl().time).toBe(5);
      fireEvent.keyDown(rail, { key: 'ArrowRight' });
      expect(lastHowl().time).toBe(10);
      fireEvent.keyDown(rail, { key: 'ArrowLeft' });
      expect(lastHowl().time).toBe(5);
      fireEvent.keyDown(rail, { key: 'ArrowLeft' });
      fireEvent.keyDown(rail, { key: 'ArrowLeft' });
      expect(lastHowl().time).toBe(0);
      fireEvent.keyDown(rail, { key: 'End' });
      expect(lastHowl().time).toBe(125);
      fireEvent.keyDown(rail, { key: 'ArrowRight' });
      expect(lastHowl().time).toBe(125);
      fireEvent.keyDown(rail, { key: 'Home' });
      expect(lastHowl().time).toBe(0);
    });

    it('leaves other keys alone', () => {
      loadedTrack();
      const rail = screen.getByRole('slider', { name: 'Seek' });
      expect(fireEvent.keyDown(rail, { key: 'a' })).toBe(true);
      expect(lastHowl().time).toBe(0);
    });
  });

  describe('volume', () => {
    it('has no mute button by default', () => {
      loadedTrack();
      expect(screen.queryByRole('button', { name: 'Mute' })).toBeNull();
    });

    it.each([[true], [0.3]])('shows a mute button for volume %s', (volume) => {
      loadedTrack({ volume });
      expect(screen.getByRole('button', { name: 'Mute' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('mutes and unmutes the player', () => {
      loadedTrack({ volume: true });
      const button = screen.getByRole('button', { name: 'Mute' });
      fireEvent.click(button);
      expect(lastHowl().mute).toHaveBeenLastCalledWith(true);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(button);
      expect(lastHowl().mute).toHaveBeenLastCalledWith(false);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('waveform', () => {
    it('draws the image behind the seek bar', () => {
      loadedTrack({ waveform: '/wave.png' });
      expect(screen.getByRole('slider', { name: 'Seek' }).style.backgroundImage).toContain('/wave.png');
    });

    it('draws nothing behind it otherwise', () => {
      loadedTrack();
      expect(screen.getByRole('slider', { name: 'Seek' }).style.backgroundImage).toBe('');
    });
  });
});

describe('AudioPlayer examples', () => {
  it('play a tune that is a well-formed WAV file', () => {
    const { src } = examples.examples[0].output.props;
    expect(src).toMatch(/^data:audio\/wav;base64,/);
    const bytes = Uint8Array.from(atob(src.split(',')[1]), (c) => c.charCodeAt(0));
    const text = (from, to) => String.fromCharCode(...bytes.slice(from, to));
    const view = new DataView(bytes.buffer);
    expect(text(0, 4)).toBe('RIFF');
    expect(text(8, 12)).toBe('WAVE');
    expect(text(36, 40)).toBe('data');
    expect(view.getUint32(40, true)).toBe(bytes.length - 44);
    // 8-bit mono at 8 kHz: 12 seconds
    expect(view.getUint32(24, true)).toBe(8000);
    expect(bytes.length - 44).toBe(8000 * 12);
  });

  it('can be mounted and removed', () => {
    examples.examples.forEach((example) => {
      const { unmount } = render(example.output);
      expect(() => unmount()).not.toThrow();
    });
  });
});
