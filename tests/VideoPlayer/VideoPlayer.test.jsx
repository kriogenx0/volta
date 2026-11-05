import { render, fireEvent, act } from '@testing-library/react';

import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';

const videoOf = (container) => container.querySelector('video');
const slashIcon = (container) => container.querySelector('[data-type="video.slash"]');

describe('VideoPlayer', () => {
  let warn;

  beforeEach(() => {
    jest.useFakeTimers();
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('markup', () => {
    it('renders without crashing', () => {
      const { container } = render(<VideoPlayer />);
      expect(container).toBeInTheDocument();
    });

    it('wraps the video in a player and adds a className', () => {
      const { container } = render(<VideoPlayer className="hero" src="/clip.mp4" />);
      expect(container.firstChild).toHaveClass('volta-video_player', 'hero');
    });

    it('plays src through a <source> of the given type', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" type="video/mp4" />);
      const source = container.querySelector('video > source');
      expect(source).toHaveAttribute('src', '/clip.mp4');
      expect(source).toHaveAttribute('type', 'video/mp4');
    });

    it('passes other props to the video element', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" controls muted playsInline />);
      expect(videoOf(container).controls).toBe(true);
      expect(videoOf(container).muted).toBe(true);
    });

    it('autoplays unless told otherwise', () => {
      const { container, rerender } = render(<VideoPlayer src="/clip.mp4" />);
      expect(videoOf(container).autoplay).toBe(true);
      rerender(<VideoPlayer src="/clip.mp4" autoPlay={false} />);
      expect(videoOf(container).autoplay).toBe(false);
    });

    it('passes a poster through', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" poster="/frame.jpg" />);
      expect(videoOf(container)).toHaveAttribute('poster', '/frame.jpg');
    });
  });

  describe('without a src', () => {
    it('shows the no-video icon and draws no <source>', () => {
      const { container } = render(<VideoPlayer />);
      expect(slashIcon(container)).toBeInTheDocument();
      expect(container.querySelector('source')).toBeNull();
    });

    // Passing "" to src or poster makes the browser fetch the page again, and React warns.
    it.each([
      ['an empty src', { src: '' }],
      ['an empty src and poster', { src: '', poster: '' }],
      ['no src and an empty poster', { poster: '' }]
    ])('never puts an empty string in the DOM with %s', (_name, props) => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { container } = render(<VideoPlayer type="video/mp4" {...props} />);
      expect(container.querySelector('[src=""]')).toBeNull();
      expect(videoOf(container)).not.toHaveAttribute('src');
      expect(videoOf(container)).not.toHaveAttribute('poster');
      expect(consoleError).not.toHaveBeenCalled();
    });

    it('does not warn about a missing video it was never given', () => {
      render(<VideoPlayer />);
      act(() => jest.advanceTimersByTime(2000));
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('reports loadeddata as a success and keeps the icon away', () => {
      const onLoadEvent = jest.fn();
      const { container } = render(<VideoPlayer src="/clip.mp4" onLoadEvent={onLoadEvent} />);

      act(() => { videoOf(container).dispatchEvent(new Event('loadeddata')); });

      expect(onLoadEvent).toHaveBeenCalledWith('loadeddata', expect.any(Event), 'success');
      expect(slashIcon(container)).toBeNull();
    });

    it('reports loadstart with no status', () => {
      const onLoadEvent = jest.fn();
      const { container } = render(<VideoPlayer src="/clip.mp4" onLoadEvent={onLoadEvent} />);

      act(() => { videoOf(container).dispatchEvent(new Event('loadstart')); });

      expect(onLoadEvent).toHaveBeenCalledWith('loadstart', expect.any(Event), null);
    });

    it('shows the failed icon when the video errors', () => {
      const onLoadEvent = jest.fn();
      const { container } = render(<VideoPlayer src="/clip.mp4" onLoadEvent={onLoadEvent} />);

      act(() => { videoOf(container).dispatchEvent(new Event('error')); });

      expect(onLoadEvent).toHaveBeenCalledWith('error', expect.any(Event), 'failed');
      expect(slashIcon(container)).toBeInTheDocument();
      expect(warn).toHaveBeenCalledWith('Video could not be found: /clip.mp4');
    });

    it('does not need an onLoadEvent', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" />);
      expect(() => act(() => { videoOf(container).dispatchEvent(new Event('loadeddata')); })).not.toThrow();
    });
  });

  describe('failTimeout', () => {
    it('gives up on a video that has not started loading after 1 second by default', () => {
      const onLoadEvent = jest.fn();
      const { container } = render(<VideoPlayer src="/clip.mp4" onLoadEvent={onLoadEvent} />);

      act(() => jest.advanceTimersByTime(999));
      expect(onLoadEvent).not.toHaveBeenCalled();
      expect(slashIcon(container)).toBeNull();

      act(() => jest.advanceTimersByTime(1));
      expect(onLoadEvent).toHaveBeenCalledWith('failed', { type: 'failed' }, 'failed');
      expect(slashIcon(container)).toBeInTheDocument();
    });

    it('waits as long as failTimeout says', () => {
      const onLoadEvent = jest.fn();
      render(<VideoPlayer src="/clip.mp4" failTimeout={300} onLoadEvent={onLoadEvent} />);

      act(() => jest.advanceTimersByTime(299));
      expect(onLoadEvent).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(1));
      expect(onLoadEvent).toHaveBeenCalledTimes(1);
    });

    it('does not fail a video that has data by then', () => {
      const onLoadEvent = jest.fn();
      const { container } = render(<VideoPlayer src="/clip.mp4" onLoadEvent={onLoadEvent} />);
      Object.defineProperty(videoOf(container), 'readyState', { value: 4 });

      act(() => jest.advanceTimersByTime(1000));

      expect(onLoadEvent).not.toHaveBeenCalled();
    });

    it('stops waiting when the player unmounts', () => {
      const onLoadEvent = jest.fn();
      const { unmount } = render(<VideoPlayer src="/clip.mp4" onLoadEvent={onLoadEvent} />);
      unmount();

      act(() => jest.advanceTimersByTime(5000));

      expect(onLoadEvent).not.toHaveBeenCalled();
    });
  });

  describe('changing src', () => {
    it('listens to the new video element and forgets the old failure', () => {
      const onLoadEvent = jest.fn();
      const { container, rerender } = render(<VideoPlayer src="/a.mp4" onLoadEvent={onLoadEvent} />);
      act(() => { videoOf(container).dispatchEvent(new Event('error')); });
      expect(slashIcon(container)).toBeInTheDocument();
      onLoadEvent.mockClear();

      rerender(<VideoPlayer src="/b.mp4" onLoadEvent={onLoadEvent} />);
      expect(slashIcon(container)).toBeNull();

      act(() => { videoOf(container).dispatchEvent(new Event('loadeddata')); });
      expect(onLoadEvent).toHaveBeenCalledWith('loadeddata', expect.any(Event), 'success');
    });

    it('starts the failure timer over for the new src', () => {
      const onLoadEvent = jest.fn();
      const { rerender } = render(<VideoPlayer src="/a.mp4" onLoadEvent={onLoadEvent} />);
      act(() => jest.advanceTimersByTime(800));

      rerender(<VideoPlayer src="/b.mp4" onLoadEvent={onLoadEvent} />);
      act(() => jest.advanceTimersByTime(800));
      expect(onLoadEvent).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(200));
      expect(onLoadEvent).toHaveBeenCalledTimes(1);
    });

    it('reports to the newest onLoadEvent', () => {
      const first = jest.fn();
      const second = jest.fn();
      const { container, rerender } = render(<VideoPlayer src="/a.mp4" onLoadEvent={first} />);

      rerender(<VideoPlayer src="/a.mp4" onLoadEvent={second} />);
      act(() => { videoOf(container).dispatchEvent(new Event('loadeddata')); });

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });
  });

  describe('play and pause', () => {
    let play;
    let pause;

    beforeEach(() => {
      play = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
      pause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    });

    it('plays a paused video when clicked, and loops it', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" />);
      fireEvent.click(videoOf(container));
      expect(play).toHaveBeenCalledTimes(1);
      expect(videoOf(container).loop).toBe(true);
    });

    it('pauses a playing video when clicked', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" />);
      Object.defineProperty(videoOf(container), 'paused', { value: false });
      fireEvent.click(videoOf(container));
      expect(pause).toHaveBeenCalledTimes(1);
      expect(play).not.toHaveBeenCalled();
    });

    it('ignores clicks once the video has failed', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" />);
      act(() => { videoOf(container).dispatchEvent(new Event('error')); });

      fireEvent.click(videoOf(container));

      expect(play).not.toHaveBeenCalled();
      expect(pause).not.toHaveBeenCalled();
    });

    it('can be played from the keyboard with Space and Enter', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" />);
      const video = videoOf(container);
      expect(video).toHaveAttribute('tabindex', '0');

      fireEvent.keyDown(video, { key: ' ' });
      fireEvent.keyDown(video, { key: 'Enter' });
      fireEvent.keyDown(video, { key: 'a' });

      expect(play).toHaveBeenCalledTimes(2);
    });

    it('leaves the keyboard to the native controls when there are controls', () => {
      const { container } = render(<VideoPlayer src="/clip.mp4" controls />);
      fireEvent.keyDown(videoOf(container), { key: ' ' });
      expect(play).not.toHaveBeenCalled();
    });
  });

  it('exposes the events it listens for', () => {
    expect(VideoPlayer.videoEvents).toEqual({ loadstart: 'loading', failed: 'failed', loadeddata: 'success' });
  });
});
