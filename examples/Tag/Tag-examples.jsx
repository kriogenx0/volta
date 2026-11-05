import { useState } from 'react';

import Button from '../../components/Button';
import Tag from '../../components/Tag/Tag';

const ClickCounter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Tag onClick={() => setCount(count + 1)}>Engineering</Tag>
      <p>Clicked {count} {count === 1 ? 'time' : 'times'}</p>
    </div>
  );
};

const INITIAL_SKILLS = ['React', 'SCSS', 'Jest'];

const RemovableTags = () => {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  return (
    <div className="example-stack">
      <div>
        {skills.map((skill) => (
          <Tag key={skill} deletable onClick={() => setSkills(skills.filter((s) => s !== skill))}>{skill}</Tag>
        ))}
      </div>
      {skills.length === 0 && <Button size="small" onClick={() => setSkills(INITIAL_SKILLS)}>Reset</Button>}
    </div>
  );
};

export default {
  name: 'Tag',
  description: 'A compact label for categorizing or filtering content. Give it onClick to make it a button, and deletable to show an x; deletable only adds the icon, so pair it with an onClick that removes the tag.',
  examples: [
    {
      name: 'Tag',
      code: '<Tag>Design</Tag>',
      output: <Tag>Design</Tag>
    },
    {
      name: 'Deletable tag',
      code: '<Tag deletable>React</Tag>',
      output: <Tag deletable>React</Tag>
    },
    {
      name: 'Clickable tag',
      code: `const [count, setCount] = useState(0);

<Tag onClick={() => setCount(count + 1)}>Engineering</Tag>
<p>Clicked {count} times</p>`,
      output: <ClickCounter />
    },
    {
      name: 'Removable tags',
      code: `const [skills, setSkills] = useState(['React', 'SCSS', 'Jest']);

{skills.map((skill) => (
  <Tag key={skill} deletable onClick={() => setSkills(skills.filter((s) => s !== skill))}>
    {skill}
  </Tag>
))}`,
      output: <RemovableTags />
    },
    {
      name: 'Tag group',
      code: `<div>
  <Tag>Frontend</Tag>
  <Tag>Backend</Tag>
  <Tag deletable>Design</Tag>
  <Tag deletable>Mobile</Tag>
</div>`,
      output: (
        <div>
          <Tag>Frontend</Tag>
          <Tag>Backend</Tag>
          <Tag deletable>Design</Tag>
          <Tag deletable>Mobile</Tag>
        </div>
      )
    },
  ]
};
