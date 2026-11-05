import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Howl } from 'howler';

import Loader from '../Loader/Loader';

import './AudioTrack.scss';

// Seconds the arrow keys move the playhead
const SEEK_STEP = 5;
const ERROR_MESSAGE = 'Could not load audio file';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// 125 seconds is "2:05"
export const formatTime = (secs) => {
  const total = Math.round(secs) || 0;
  const seconds = total % 60;
  return Math.floor(total / 60) + ':' + (seconds < 10 ? '0' : '') + seconds;
};

// Drawn here (not an icon font) so the controls show wherever the page does.
// Everything takes its colour from the text.
const Glyph = ({ children }) => (
  <svg className="audio_track-icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const PlayIcon = () => <Glyph><path d="M8 5v14l11-7z" fill="currentColor" /></Glyph>;
const PauseIcon = () => <Glyph><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" /></Glyph>;
const SpeakerIcon = ({ muted }) => (
  <Glyph>
    <path d="M3 9v6h4l5 5V4L7 9z" fill="currentColor" />
    {muted
      ? <path d="M16 9l6 6M22 9l-6 6" />
      : <path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />}
  </Glyph>
);
const ErrorIcon = () => <Glyph><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></Glyph>;

// A small audio player for one file: play and pause, the time played, a bar to
// click or drag to seek (arrow keys too), the length and, with `volume`, a mute
// button. `loop`, `volume` and `autoplay` are read when the file loads, and a
// new `src` loads a new file.
const AudioTrack = ({ src, autoplay = false, loop = false, volume = false, waveform }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const player = useRef(null);
  const rail = useRef(null);
  const dragging = useRef(false);

  // (Re)load the file. Everything the player reports comes back through these
  // callbacks; `active` stops one from a file that has since been replaced or
  // removed from touching the screen.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPlaying(false);
    setMuted(false);
    setPosition(0);
    setDuration(0);

    if (!src) {
      setLoading(false);
      setError(ERROR_MESSAGE);
      return undefined;
    }

    const howl = new Howl({
      src: [src],
      autoplay,
      loop,
      volume: typeof volume === 'number' ? clamp(volume, 0, 1) : 1,
      onplay: () => active && setPlaying(true),
      onpause: () => active && setPlaying(false),
      onstop: () => active && setPlaying(false),
      onend: () => {
        // A looping track carries straight on; otherwise it is back at the start
        if (!active || loop) return;
        setPlaying(false);
        setPosition(0);
      },
      onload: () => {
        if (!active) return;
        setDuration(howl.duration());
        setLoading(false);
      },
      onloaderror: () => {
        if (!active) return;
        setLoading(false);
        setError(ERROR_MESSAGE);
      }
    });
    player.current = howl;

    return () => {
      active = false;
      player.current = null;
      howl.unload();
    };
  }, [src]);

  // While playing, follow the playhead once per frame
  useEffect(() => {
    if (!playing) return undefined;

    let frame;
    const step = () => {
      if (!player.current) return;
      setPosition(player.current.seek() || 0);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const seekTo = (secs) => {
    if (!player.current) return;
    const next = clamp(secs, 0, duration);
    player.current.seek(next);
    setPosition(next);
  };

  const seekToPointer = (clientX) => {
    if (!rail.current) return;
    const { left, width } = rail.current.getBoundingClientRect();
    if (!width) return;
    seekTo(clamp((clientX - left) / width, 0, 1) * duration);
  };

  const handlePointerDown = (event) => {
    if (event.button) return; // main button, touch or pen only
    dragging.current = true;
    if (event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId);
    seekToPointer(event.clientX);
  };

  const handlePointerMove = (event) => {
    if (dragging.current) seekToPointer(event.clientX);
  };

  const handlePointerEnd = () => {
    dragging.current = false;
  };

  const handleKeyDown = (event) => {
    const moves = {
      ArrowRight: position + SEEK_STEP,
      ArrowUp: position + SEEK_STEP,
      ArrowLeft: position - SEEK_STEP,
      ArrowDown: position - SEEK_STEP,
      Home: 0,
      End: duration
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    seekTo(moves[event.key]);
  };

  const handleTogglePlay = () => {
    if (!player.current) return;
    if (playing) player.current.pause();
    else player.current.play();
  };

  const handleToggleMute = () => {
    if (!player.current) return;
    player.current.mute(!muted);
    setMuted(!muted);
  };

  const renderContents = () => {
    if (error) {
      return (
        <div className='error' role='alert'>
          <ErrorIcon />
          {error}
        </div>
      );
    }

    if (loading) {
      return <Loader variant="bars" />;
    }

    const railStyle = {};
    if (waveform) railStyle.backgroundImage = `url('${waveform}')`;
    const percent = duration ? clamp(100 * position / duration, 0, 100) : 0;

    return (
      <div className='audio_track-controls'>
        <button type='button' className='play control' aria-label={playing ? 'Pause' : 'Play'} onClick={handleTogglePlay}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className='time'>
          {formatTime(position)}
        </div>
        <div
          className='rail'
          role='slider'
          tabIndex={0}
          aria-label='Seek'
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
          ref={rail}
          style={railStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown}
        >
          <div className='rail-elapsed_percent' style={{ width: `${percent}%` }} />
        </div>
        <div className='duration'>
          {formatTime(duration)}
        </div>
        {volume !== false && (
          <button type='button' className='volume control' aria-label='Mute' aria-pressed={muted} onClick={handleToggleMute}>
            <SpeakerIcon muted={muted} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className='volta-audio_track no_select' aria-busy={loading || undefined}>
      {renderContents()}
    </div>
  );
};

AudioTrack.propTypes = {
  // URL of the audio file (a data URI works too)
  src: PropTypes.string.isRequired,
  // Start playing as soon as it loads (browsers may block this until the page has been clicked)
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  // false hides the mute button; true shows it; a number from 0 to 1 shows it and sets the starting volume
  volume: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  // Image URL drawn behind the seek bar, e.g. the track's waveform
  waveform: PropTypes.string
};

export default AudioTrack;
