import PageWidth from '../../components/PageWidth/PageWidth';
import Card from '../../components/Card/Card';

export default {
  name: 'PageWidth',
  description: 'Centers its content in a column at most 960px wide, with side padding so text never touches the edge of the screen. Use it as the outer wrapper of a page.',
  examples: [
    {
      name: 'Centered column',
      code: `<PageWidth>
  <Card>Content stays inside the page column.</Card>
</PageWidth>`,
      output: (
        <PageWidth>
          <Card>Content stays inside the page column.</Card>
        </PageWidth>
      )
    },
    {
      name: 'With a class name',
      code: `<PageWidth className="view-reports">
  <h2>Reports</h2>
  <p>A view can hook its own styles onto the wrapper.</p>
</PageWidth>`,
      output: (
        <PageWidth className="view-reports">
          <h2>Reports</h2>
          <p>A view can hook its own styles onto the wrapper.</p>
        </PageWidth>
      )
    },
    {
      name: 'Several blocks',
      code: `<PageWidth>
  <Card>First</Card>
  <Card>Second</Card>
</PageWidth>`,
      output: (
        <PageWidth>
          <div className="example-stack">
            <Card>First</Card>
            <Card>Second</Card>
          </div>
        </PageWidth>
      )
    }
  ]
};
