import TagInput from './TagInput';

export default {
  name: 'TagInput',
  description: 'Textfield with tags',
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
    }
  ]
};
