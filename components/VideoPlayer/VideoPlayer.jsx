import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from "../Icon";
import Loader from "../Loader";

import "./VideoPlayer.scss";

const VideoPlayer = ({
    className,
    failTimeout = 1000,
    onLoadEvent = () => {},
    src,
    type,
    poster,
    ...otherProps
  }) => {

  // The status belongs to the src it was reported for, so a new src starts clean.
  const [loadState, setLoadState] = useState({ src, status: null });
  const status = loadState.src === src ? loadState.status : null;

  const video = useRef(null);

  // Load events call the newest onLoadEvent, not the one from when they were bound.
  const onLoadEventRef = useRef(onLoadEvent);
  useEffect(() => {
    onLoadEventRef.current = onLoadEvent;
  });

  const handleClick = () => {
    if (!video.current || status == 'loading' || status == 'failed') return;
    const v = video.current;
    v.loop = true;
    v.paused || v.ended ? v.play() : v.pause();
  };

  // Without native controls the video is a click target; let the keyboard use it too.
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleClick();
  };

  useEffect(() => {
    const el = video.current;
    if (!el) return undefined;

    const videoLoadEvent = e => {
      let newStatus;
      if (e.type == 'loadstart') {
        // newStatus = 'loading';
        newStatus = null;
      } else if (e.type == 'failed' || e.type == 'error') {
        newStatus = 'failed';
        if (src) console.warn("Video could not be found: " + src);
      } else if (e.type == 'loadeddata') {
        newStatus = 'success';
      } else {
        newStatus = null;
        console.log("Video triggered unknown event type:", e.type);
      }
      onLoadEventRef.current && onLoadEventRef.current(e.type, e, newStatus);
      setLoadState({ src, status: newStatus });
    };

    el.addEventListener('loadeddata', videoLoadEvent);
    el.addEventListener('error', videoLoadEvent);
    el.addEventListener('loadstart', videoLoadEvent);

    const timer = setTimeout(() => {
      if (el.readyState == 0) videoLoadEvent({ type: 'failed' });
    }, failTimeout);

    return () => {
      clearTimeout(timer);
      el.removeEventListener('loadeddata', videoLoadEvent);
      el.removeEventListener('error', videoLoadEvent);
      el.removeEventListener('loadstart', videoLoadEvent);
    };
  }, [src, failTimeout]);


  let icon;
  if (status == 'loading') {
    icon = <Loader />;
  } else if (status == 'failed' || !src) {
    icon = <Icon type='video.slash' />;
  }

  // An empty src or poster would make the browser fetch the page itself, so
  // they are left off the element (and no <source> is drawn) when empty.
  const keyboardProps = otherProps.controls ? {} : { tabIndex: 0, onKeyDown: handleKeyDown };

  return (
    <div className={'volta-video_player' + (className ? ' ' + className : '')}>
      { icon ? <div className='full'>{icon}</div> : null }

      <video ref={video} autoPlay loop={false} key={src} {...keyboardProps} {...otherProps} poster={poster || undefined} onClick={handleClick}>
        {src ? <source src={src} type={type} /> : null}
      </video>
    </div>
  );
};

VideoPlayer.propTypes = {
  className: PropTypes.string,
  // Milliseconds to wait for the video to start loading before showing the
  // failed state.
  failTimeout: PropTypes.number,
  // Called with (eventType, event, status) as the video loads or fails; status
  // is 'success', 'failed' or null.
  onLoadEvent: PropTypes.func,
  src: PropTypes.string,
  type: PropTypes.string,
  // Image shown before the video plays.
  poster: PropTypes.string
  // Any other prop (controls, muted, loop, autoPlay...) goes to the <video>.
};

VideoPlayer.videoEvents = {
  loadstart: 'loading',
  failed: 'failed',
  loadeddata: 'success'
};

export default VideoPlayer;
