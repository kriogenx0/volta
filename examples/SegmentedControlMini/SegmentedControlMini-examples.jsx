import { useState } from 'react';
import SegmentedControlMini from '../../components/SegmentedControlMini/SegmentedControlMini';

function Demo() {
  const [index, setIndex] = useState(0);
  return (
    <SegmentedControlMini
      tabs={['Desktop', 'Mobile']}
      selectedTabIndex={index}
      onChange={setIndex}
      ariaLabel='Preview device'
    />
  );
}

export default {
  name: 'SegmentedControlMini',
  description: 'Compact pill-style tab switcher, e.g. for a device preview toggle.',
  examples: [
    {
      name: 'Default',
      code: "<SegmentedControlMini tabs={['Desktop', 'Mobile']} selectedTabIndex={0} onChange={...} />",
      output: <Demo />
    }
  ]
};
