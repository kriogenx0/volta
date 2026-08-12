import Button from '../../components/Button/Button';

export default {
  name: 'Button',
  description: 'A magical clickable box.',
  examples: [
    {
      name: 'Plain Button',
      code: (
        '<Button>Plain Button</Button>'
      ),
      output: (
        <Button>Plain Button</Button>
      )
    },

    {
      name: 'Primary Button',
      code: (
        '<Button variant="primary">Primary Button</Button>'
      ),
      output: (
        <Button variant="primary">Primary Button</Button>
      )
    },

    {
      name: 'Danger Button',
      code: (
        '<Button variant="danger">Danger Button</Button>'
      ),
      output: (
        <Button variant="danger">Danger Button</Button>
      )
    },

    {
      name: 'Link Button',
      code: (
        '<Button variant="link">Link Button</Button>'
      ),
      output: (
        <Button variant="link">Link Button</Button>
      )
    },

    {
      name: 'Button Small',
      code: (
        '<Button size="small">Small</Button>'
      ),
      output: (
        <Button size="small">Small</Button>
      )
    },

    {
      name: 'Button Disabled',
      code: (
        '<Button disabled={true}>Disabled</Button>'
      ),
      output: (
        <Button disabled={true}>Disabled</Button>
      )
    }
  ]
};
