import VideoUploadPlayer from './VideoUploadPlayer';

export default {
  name: 'VideoUploadPlayer',
  description: 'Combines video upload (drag-and-drop) with a video player for preview after upload.',
  examples: [
    {
      name: 'VideoUploadPlayer',
      code: `<VideoUploadPlayer
  onChange={(file) => console.log(file)}
  onCancel={() => console.log('cancelled')}
/>`,
      output: (
        <VideoUploadPlayer
          onChange={(file) => {}}
          onCancel={() => {}}
        />
      )
    },
    {
      name: 'With upload progress',
      code: `<VideoUploadPlayer fileName="my-video.mp4" percent={40} />`,
      output: (
        <VideoUploadPlayer fileName="my-video.mp4" percent={40} />
      )
    },
  ]
};
