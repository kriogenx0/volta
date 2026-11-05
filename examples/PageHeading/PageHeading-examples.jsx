import PageHeading from '../../components/PageHeading/PageHeading';
import Button from '../../components/Button/Button';

export default {
  name: 'PageHeading',
  description: 'The page title (an h1) on the left with room for actions on the right, wrapping under the title on narrow screens. `text` is the title and children are the actions.',
  examples: [
    {
      name: 'Title only',
      code: '<PageHeading text="Projects" />',
      output: <PageHeading text="Projects" />
    },
    {
      name: 'With an action',
      code: `<PageHeading text="Projects">
  <Button variant="primary">New project</Button>
</PageHeading>`,
      output: (
        <PageHeading text="Projects">
          <Button variant="primary">New project</Button>
        </PageHeading>
      )
    },
    {
      name: 'With several actions',
      code: `<PageHeading text="Invoice #1042">
  <Button>Download</Button>
  <Button variant="danger">Void</Button>
</PageHeading>`,
      output: (
        <PageHeading text="Invoice #1042">
          <Button>Download</Button>
          <Button variant="danger">Void</Button>
        </PageHeading>
      )
    }
  ]
};
