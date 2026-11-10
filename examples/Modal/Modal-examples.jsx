import { useState } from 'react';

import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import TextBox from '../../components/TextBox/TextBox';

const Titled = () => {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  return (
    <div>
      <Button onClick={() => setShow(true)}>Open modal</Button>
      <Modal show={show} title="Delete item" onClose={close}>
        <p>Are you sure you want to delete this item? This can't be undone.</p>
        <Button variant="danger" onClick={close}>Delete</Button>{' '}
        <Button onClick={close}>Keep</Button>
      </Modal>
    </div>
  );
};

const WithForm = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState('');
  const close = () => setShow(false);
  const save = () => {
    setSaved(name.trim());
    close();
  };
  return (
    <div>
      <Button onClick={() => setShow(true)}>Rename</Button>
      <p>Saved name: {saved || 'none yet'}</p>
      <Modal show={show} title="Rename project" onClose={close}>
        <TextBox label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <p>
          <Button variant="primary" onClick={save}>Save</Button>{' '}
          <Button onClick={close}>Cancel</Button>
        </p>
      </Modal>
    </div>
  );
};

const Container = ({ inside = false }) => {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  const body = (
    <>
      <p>Click the dimmed page, press Escape, or use the button to close.</p>
      <Button onClick={close}>Close</Button>
    </>
  );
  return (
    <div>
      <Button onClick={() => setShow(true)}>Open modal</Button>
      <Modal show={show} onHide={close} headerTitle="Heading">
        {inside ? <Modal.inside>{body}</Modal.inside> : body}
      </Modal>
    </div>
  );
};

export default {
  name: 'Modal',
  description: 'A dimmed backdrop with a centered panel. Give it a title or onClose for a titled modal with a close button, or leave both off to wrap your own content (with onHide for the backdrop). Hide it by setting show to false; Escape and a click on the backdrop ask the parent to close it. While open it locks page scroll and keeps Tab inside the panel, then returns focus to the control that opened it; modal={false} turns that off for a modal shown in the page flow.',
  examples: [
    {
      name: 'Titled modal',
      code: `const [show, setShow] = useState(false);

<Button onClick={() => setShow(true)}>Open modal</Button>
<Modal show={show} title="Delete item" onClose={() => setShow(false)}>
  <p>Are you sure you want to delete this item?</p>
  <Button variant="danger" onClick={() => setShow(false)}>Delete</Button>
</Modal>`,
      output: <Titled />
    },
    {
      name: 'With a form',
      code: `<Modal show={show} title="Rename project" onClose={close}>
  <TextBox label="Name" value={name} onChange={(e) => setName(e.target.value)} />
  <Button variant="primary" onClick={save}>Save</Button>
  <Button onClick={close}>Cancel</Button>
</Modal>`,
      output: <WithForm />
    },
    {
      name: 'Container form (show and onHide)',
      code: `<Modal show={show} onHide={() => setShow(false)} headerTitle="Heading">
  <p>Click the dimmed page, press Escape, or use the button to close.</p>
  <Button onClick={() => setShow(false)}>Close</Button>
</Modal>`,
      output: <Container />
    },
    {
      name: 'Padded content with Modal.inside',
      code: `<Modal show={show} onHide={close} headerTitle="Heading">
  <Modal.inside>
    <p>Extra side padding around the content.</p>
  </Modal.inside>
</Modal>`,
      output: <Container inside />
    }
  ]
};
