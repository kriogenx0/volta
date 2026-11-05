import Link from '../../components/Link/Link';

// The demos below stop the click so the styleguide itself never navigates
const stay = (e) => e.preventDefault();

export default {
  name: 'Link',
  description: 'A plain anchor with the Volta link class. Its `to` is the href, and `:name` segments in it are filled in from the params object. Any other prop (target, rel, onClick) goes to the anchor.',
  examples: [
    {
      name: 'Link',
      code: '<Link to="/projects">Projects</Link>',
      output: <Link to="/projects" onClick={stay}>Projects</Link>
    },
    {
      name: 'Filling route params',
      code: `<Link to="/users/:id/posts/:postId" params={{ id: 42, postId: 7 }}>
  /users/42/posts/7
</Link>`,
      output: (
        <Link to="/users/:id/posts/:postId" params={{ id: 42, postId: 7 }} onClick={stay}>
          /users/42/posts/7
        </Link>
      )
    },
    {
      name: 'Opening in a new tab',
      code: '<Link to="https://example.com" target="_blank" rel="noreferrer">Example</Link>',
      output: <Link to="https://example.com" target="_blank" rel="noreferrer">Example</Link>
    },
    {
      name: 'Extra class',
      code: '<Link to="/help" className="help_link">Help</Link>',
      output: <Link to="/help" className="help_link" onClick={stay}>Help</Link>
    }
  ]
};
