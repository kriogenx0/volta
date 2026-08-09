import { useRef, useEffect, useState } from 'react';

import Icon from "../Icon";
import Loader from "../Loader";

import "./VideoPlayer.scss";

const VideoPlayer = ({
    className,
    failTimeout,
    onLoadEvent,
    src,
    type,
    ...otherProps
  }) => {

  const [status, setStatus] = useState(null);

  const video = useRef(null);

  const handleClick = () => {
    if (!video.current || status == 'loading' || status == 'failed') return;
    const v = video.current;
    v.loop = true;
    v.paused || v.ended ? v.play() : v.pause();
  };

  const videoLoadEvent = e => {
    let newStatus;
    if (e.type == 'loadstart') {
      // newStatus = 'loading';
      newStatus = null;
    } else if (e.type == 'failed' || e.type == 'error') {
      newStatus = 'failed';
      console.warn("Video could not be found: " + src);
    } else if (e.type == 'loadeddata') {
      newStatus = 'success';
    } else {
      newStatus = null;
      console.log("Video triggered unknown event type:", e.type);
    }
    onLoadEvent && onLoadEvent(e.type, e, newStatus);
    setStatus(newStatus);
  };

  useEffect(() => {
    video.current.addEventListener('loadeddata', videoLoadEvent);
    video.current.addEventListener('error', videoLoadEvent);
    video.current.addEventListener('loadstart', videoLoadEvent);

    setTimeout(() => {
      if (!video.current || video.current.readyState == 0) videoLoadEvent({ type: 'failed' });
    }, failTimeout);

    return () => {
      video.current.removeEventListener('loadeddata', videoLoadEvent);
      video.current.removeEventListener('error', videoLoadEvent);
      video.current.removeEventListener('loadstart', videoLoadEvent);
    };
  }, []);


  let icon;
  if (status == 'loading') {
    icon = <Loader />;
  } else if (status == 'failed' || !src) {
    icon = <Icon type='video.slash' />;
  }

  return (
    <div className={'soda-video_player' + (className ? ' ' + className : '')}>
      { icon ? <div className='full'>{icon}</div> : null }

      <video ref={video} autoPlay loop={false} key={src} {...otherProps} onClick={handleClick}>
        <source src={src} type={type} />
      </video>
    </div>
  );
};

VideoPlayer.propTypes = {
  className: PropTypes.string,
  onLoadEvent: PropTypes.func,
  src: PropTypes.string,
  type: PropTypes.string
  // children:
};

VideoPlayer.defaultProps = {
  failTimeout: 1000,
  onLoadEvent: () => {}
};

VideoPlayer.videoEvents = {
  loadstart: 'loading',
  failed: 'failed',
  loadeddata: 'success'
};

export default VideoPlayer;
