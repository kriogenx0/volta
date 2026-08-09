import Button from '../Button';
import Icon from '../Icon';

import './CloseButton.scss';

const CloseButton = props => (
  <Button variant="link" className="close-button" {...props}>
    <Icon type="multiply"/>
  </Button>
);

export default CloseButton;
