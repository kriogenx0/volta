import { useState } from 'react';

import { Button, Dialog, NativeSelect, Tabs, TextBox, Toggle } from '../../../components';

import { COUNTRIES, NOTIFICATIONS, SETTINGS_TABS } from './examples-data';

const Profile = () => (
  <form className="sample-form" onSubmit={(event) => event.preventDefault()}>
    <TextBox label="Display name" defaultValue="Ada Lovelace" />
    <TextBox label="Email" type="email" defaultValue="ada@analytical.example" hint="We send receipts here." />
    <NativeSelect label="Country" options={COUNTRIES} defaultValue="gb" />
    <TextBox label="Bio" multiline defaultValue="Mathematician. Wrote the first program." />
    <div className="sample-row">
      <Button variant="primary" type="submit">Save changes</Button>
      <Button type="button">Cancel</Button>
    </div>
  </form>
);

const Notifications = () => {
  const [on, setOn] = useState(() => Object.fromEntries(NOTIFICATIONS.map((item) => [item.key, item.defaultOn])));

  return (
    <ul className="sample-switches">
      {NOTIFICATIONS.map((item) => (
        <li key={item.key}>
          <span id={`notify-${item.key}`}>{item.label}</span>
          <Toggle
            aria-labelledby={`notify-${item.key}`}
            checked={on[item.key]}
            onChange={(event) => setOn({ ...on, [item.key]: event.target.checked })}
          />
        </li>
      ))}
    </ul>
  );
};

const DangerZone = () => {
  const [asking, setAsking] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="sample-danger">
      <h3>Delete account</h3>
      <p className="sample-muted">The account and everything in it is removed for good. This cannot be undone.</p>
      <Button variant="danger" onClick={() => setAsking(true)}>Delete account</Button>
      {deleted && <p className="sample-note" role="status">Deleted (this is only an example).</p>}
      <Dialog
        isOpen={asking}
        variant="confirmation"
        danger
        title="Delete your account?"
        titleSave="Delete"
        handleSave={() => { setAsking(false); setDeleted(true); }}
        handleClose={() => setAsking(false)}
      >
        Everything in it will be removed.
      </Dialog>
    </div>
  );
};

const PANELS = [Profile, Notifications, DangerZone];

// Settings in tabs: a profile form, switches that apply at once, and a destructive action
// behind a confirmation.
const Settings = () => {
  const [tab, setTab] = useState(0);
  const Panel = PANELS[tab];

  return (
    <div className="sample-settings">
      <div className="sample-heading">
        <div>
          <h2>Account settings</h2>
          <p className="sample-muted">Manage your account and how we contact you.</p>
        </div>
      </div>
      <Tabs tabs={SETTINGS_TABS} selectedTabKey={tab} onSelect={setTab} />
      <div className="sample-panel"><Panel /></div>
    </div>
  );
};

export default Settings;
