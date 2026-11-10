import { useState } from 'react';

import Link, { ActionLink } from '../../components/Link/Link';

// The demos below stop the click so the styleguide itself never navigates
const stay = (e) => e.preventDefault();

const Counter = () => {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="example-stack">
      <ActionLink to="/clicked" onClick={(e) => { e.preventDefault(); setClicks(clicks + 1); }}>
        Mark as read
      </ActionLink>
      <p>Clicked {clicks} times</p>
    </div>
  );
};

export default {
  name: 'Link',
  description: 'A link to another page. By default a plain anchor with the Volta link class: `to` is the href, `:name` segments in it are filled in from the params object, and any other prop (target, rel, onClick) goes to the anchor. `router` navigates with React Router instead, and `variant="action"` is the quiet look for headers and toolbars; ActionLink is that variant with the router on.',
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
    },
    {
      name: 'Action variant',
      code: `<Link variant="action" router to="/edit">Edit</Link>
<ActionLink to="/share">Share</ActionLink>
<ActionLink to="/delete">Delete</ActionLink>`,
      output: (
        <div className="example-stack">
          <Link variant="action" router to="/edit">Edit</Link>
          <ActionLink to="/share">Share</ActionLink>
          <ActionLink to="/delete">Delete</ActionLink>
        </div>
      )
    },
    {
      name: 'ActionLink with a click handler',
      code: `<ActionLink to="/clicked" onClick={(e) => { e.preventDefault(); setClicks(clicks + 1); }}>
  Mark as read
</ActionLink>`,
      output: <Counter />
    },
    {
      name: 'To a path object',
      code: '<ActionLink to={{ pathname: "/search", search: "?q=volta" }}>Search for volta</ActionLink>',
      output: <ActionLink to={{ pathname: '/search', search: '?q=volta' }}>Search for volta</ActionLink>
    }
  ]
};
