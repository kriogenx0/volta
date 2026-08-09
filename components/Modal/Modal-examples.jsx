import { useState } from "react";

import Button from '../Button';
import Modal from './Modal';

function ModalExample() {
  const [modalShowing, setModalShowing] = useState(true);

  return (
    <div>
      <Button onClick={() => { setModalShowing(true) }}>Show Modal</Button>
      <Modal show={modalShowing}>
        <Button onClick={() => { setModalShowing(false) }}></Button>
      </Modal>
    </div>
  );
}

export default {
  name: 'Modal',
  description: 'A dialog box.',
  examples: [
    {
      name: 'Modal',
      code: (
        '<Modal>Modal</Modal>'
      ),
      output: (
        <ModalExample />
      )
    },
  ]
};
