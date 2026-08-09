import TabBar from '../TabBar/TabBar';

import './SegmentedControl.scss';

const SegmentedControl = (props) => (
  <div className="c-segmented_control no_select">
    <TabBar {...props} />
  </div>
);

export default SegmentedControl;
