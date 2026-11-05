import { useState } from 'react';

import ListCard, { ListCardRow } from '../../components/ListCard/ListCard';

const PROJECTS = ['Apollo', 'Borealis', 'Cascade'];

const ProjectPicker = () => {
  const [project, setProject] = useState('Apollo');

  return (
    <div className="example-stack">
      <ListCard>
        {PROJECTS.map((name) => (
          <ListCardRow key={name} onClick={() => setProject(name)}>
            <span>{name}</span>
            <span>{project === name ? 'Current' : 'Switch'}</span>
          </ListCardRow>
        ))}
      </ListCard>
      <p>Current project: {project}</p>
    </div>
  );
};

export default {
  name: 'ListCard',
  description: 'A bordered card of stacked rows. Rows are buttons by default and react to the cursor; use as="div" for static rows that only display information.',
  examples: [
    {
      name: 'Clickable rows',
      code: `const [project, setProject] = useState('Apollo');

<ListCard>
  {['Apollo', 'Borealis', 'Cascade'].map((name) => (
    <ListCardRow key={name} onClick={() => setProject(name)}>
      <span>{name}</span>
      <span>{project === name ? 'Current' : 'Switch'}</span>
    </ListCardRow>
  ))}
</ListCard>`,
      output: <ProjectPicker />
    },
    {
      name: 'Static rows',
      code: `<ListCard>
  <ListCardRow as="div"><span>Plan</span><span>Team</span></ListCardRow>
  <ListCardRow as="div"><span>Seats</span><span>12</span></ListCardRow>
  <ListCardRow as="div"><span>Renews</span><span>Jan 1, 2027</span></ListCardRow>
</ListCard>`,
      output: (
        <ListCard>
          <ListCardRow as="div"><span>Plan</span><span>Team</span></ListCardRow>
          <ListCardRow as="div"><span>Seats</span><span>12</span></ListCardRow>
          <ListCardRow as="div"><span>Renews</span><span>Jan 1, 2027</span></ListCardRow>
        </ListCard>
      )
    },
    {
      name: 'Static header over actions',
      code: `<ListCard>
  <ListCardRow as="div"><span>Billing</span></ListCardRow>
  <ListCardRow onClick={updateCard}><span>Update payment method</span></ListCardRow>
  <ListCardRow onClick={downloadInvoices}><span>Download invoices</span></ListCardRow>
</ListCard>`,
      output: (
        <ListCard>
          <ListCardRow as="div"><span>Billing</span></ListCardRow>
          <ListCardRow onClick={() => {}}><span>Update payment method</span></ListCardRow>
          <ListCardRow onClick={() => {}}><span>Download invoices</span></ListCardRow>
        </ListCard>
      )
    },
    {
      name: 'Single row',
      code: `<ListCard>
  <ListCardRow onClick={invite}><span>Invite a teammate</span></ListCardRow>
</ListCard>`,
      output: (
        <ListCard>
          <ListCardRow onClick={() => {}}><span>Invite a teammate</span></ListCardRow>
        </ListCard>
      )
    }
  ]
};
