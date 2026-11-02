import TagInput from '../../components/TagInput/TagInput';

export default {
  name: 'TagInput',
  description: 'Textfield with tags. Tags can\'t be removed unless you set removable.',
  examples: [
    {
      name: 'TagInput',
      code: (
        '<TagInput/>'
      ),
      output: (
        <TagInput/>
      )
    },
    {
      name: 'TagInput with existing tags and placeholder',
      code: (
        '<TagInput placeholder="Enter tags here" tags={["tag1", "tag2"]} />'
      ),
      output: (
        <TagInput placeholder="Enter tags here" tags={["tag1", "tag2"]} />
      )
    },
    {
      name: 'TagInput with removable tags (shows an x on each tag)',
      code: (
        '<TagInput removable placeholder="Enter tags here" tags={["tag1", "tag2"]} />'
      ),
      output: (
        <TagInput removable placeholder="Enter tags here" tags={["tag1", "tag2"]} />
      )
    }
  ]
};
