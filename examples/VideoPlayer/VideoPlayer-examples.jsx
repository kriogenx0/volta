import { useState } from 'react';

import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import Button from '../../components/Button/Button';

// A gray frame drawn as an inline SVG, so the poster needs no file or network.
const POSTER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="lightgray"/><text x="320" y="190" font-size="32" text-anchor="middle" fill="dimgray">Poster frame</text></svg>'
)}`;

// No video file ships with the styleguide, so these point at paths that do not
// exist. They show what the player does when a video cannot be loaded.
const MISSING = ['/media/intro.mp4', '/media/outro.mp4'];

const STATUS_TEXT = { success: 'Loaded', failed: 'Could not load' };

const LoadStatus = () => {
  const [status, setStatus] = useState(null);

  return (
    <div className="example-stack">
      <VideoPlayer
        src="/media/intro.mp4"
        type="video/mp4"
        failTimeout={500}
        onLoadEvent={(eventType, event, newStatus) => setStatus(newStatus)}
      />
      <p>{STATUS_TEXT[status] || 'Waiting for the video...'}</p>
    </div>
  );
};

const SwitchSource = () => {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState(null);

  const choose = (next) => {
    setStatus(null);
    setIndex(next);
  };

  return (
    <div className="example-stack">
      <div>
        {MISSING.map((path, i) => (
          <Button key={path} variant={i === index ? 'primary' : 'default'} onClick={() => choose(i)}>{path}</Button>
        ))}
      </div>
      <VideoPlayer
        src={MISSING[index]}
        type="video/mp4"
        failTimeout={500}
        onLoadEvent={(eventType, event, newStatus) => setStatus(newStatus)}
      />
      <p>{`${MISSING[index]}: ${STATUS_TEXT[status] || 'waiting...'}`}</p>
    </div>
  );
};

export default {
  name: 'VideoPlayer',
  description: 'An HTML5 video that plays or pauses when clicked (or on Space or Enter), with a no-video icon when there is no src or the video fails to load. Give it src and type; every other prop (controls, muted, poster, autoPlay) goes to the <video>. onLoadEvent reports loading and failure, and failTimeout sets how long to wait before calling a video failed. No sample video ships with the styleguide, so the examples show the empty and failed states.',
  examples: [
    {
      name: 'No video (no src)',
      code: '<VideoPlayer />',
      output: <VideoPlayer />
    },
    {
      name: 'Poster with native controls',
      code: '<VideoPlayer controls muted autoPlay={false} poster={posterUrl} />',
      output: <VideoPlayer controls muted autoPlay={false} poster={POSTER} />
    },
    {
      name: 'Video that fails to load',
      code: `const [status, setStatus] = useState(null);

<VideoPlayer
  src="/media/intro.mp4"
  type="video/mp4"
  failTimeout={500}
  onLoadEvent={(eventType, event, newStatus) => setStatus(newStatus)}
/>
<p>{status === 'failed' ? 'Could not load' : 'Waiting for the video...'}</p>`,
      output: <LoadStatus />
    },
    {
      name: 'Switching the source',
      code: `<VideoPlayer
  src={paths[index]}
  type="video/mp4"
  failTimeout={500}
  onLoadEvent={(eventType, event, newStatus) => setStatus(newStatus)}
/>`,
      output: <SwitchSource />
    }
  ]
};
