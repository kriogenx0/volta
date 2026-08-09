import VideoPlayer from './VideoPlayer';

export default {
  name: 'VideoPlayer',
  description: 'A styled HTML5 video player with loading and error states.',
  examples: [
    {
      name: 'Video player (no src)',
      code: '<VideoPlayer src="https://example.com/video.mp4" type="video/mp4" />',
      output: (
        <div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
            VideoPlayer renders an HTML5 video element. Provide a valid <code>src</code> URL and <code>type</code> (e.g. <code>video/mp4</code>).
          </p>
          <VideoPlayer src="" type="video/mp4" />
        </div>
      )
    },
  ]
};
