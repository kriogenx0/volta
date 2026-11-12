import { useState } from 'react';

import { Avatar, Badge, Button, Empty, List, ListRow, TextBox } from '../../../components';

import { PEOPLE } from './examples-data';

// A searchable list of people, each with a role, and an empty state for no matches.
const People = () => {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const shown = PEOPLE.filter((person) => `${person.name} ${person.email}`.toLowerCase().includes(needle));

  return (
    <div className="sample-list">
      <div className="sample-heading">
        <div>
          <h2>Team</h2>
          <p className="sample-muted">{PEOPLE.length} people have access.</p>
        </div>
        <Button variant="primary">Invite</Button>
      </div>

      <TextBox type="search" aria-label="Search people" placeholder="Search by name or email" value={query} onChange={(event) => setQuery(event.target.value)} />

      {shown.length === 0 ? (
        <Empty icon="questionmark">No one matches &ldquo;{query.trim()}&rdquo;.</Empty>
      ) : (
        <List card>
          {shown.map((person) => (
            <ListRow as="div" key={person.email}>
              <div className="sample-row sample-row--between">
                <div className="sample-person">
                  <Avatar name={person.name} />
                  <span><strong>{person.name}</strong><br /><small className="sample-muted">{person.email}</small></span>
                </div>
                <Badge tone={person.tone}>{person.role}</Badge>
              </div>
            </ListRow>
          ))}
        </List>
      )}
    </div>
  );
};

export default People;
