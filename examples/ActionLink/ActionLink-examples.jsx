import { useState } from 'react';

import ActionLink from '../../components/ActionLink/ActionLink';

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
  name: 'ActionLink',
  description: 'A small, quiet router link for secondary actions such as "Edit" or "View all". It is a react-router Link underneath, so `to`, `replace`, `state` and `onClick` all work.',
  examples: [
    {
      name: 'ActionLink',
      code: '<ActionLink to="/settings">Settings</ActionLink>',
      output: <ActionLink to="/settings">Settings</ActionLink>
    },
    {
      name: 'Several links',
      code: `<ActionLink to="/edit">Edit</ActionLink>
<ActionLink to="/share">Share</ActionLink>
<ActionLink to="/delete">Delete</ActionLink>`,
      output: (
        <div className="example-stack">
          <ActionLink to="/edit">Edit</ActionLink>
          <ActionLink to="/share">Share</ActionLink>
          <ActionLink to="/delete">Delete</ActionLink>
        </div>
      )
    },
    {
      name: 'With a click handler',
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
