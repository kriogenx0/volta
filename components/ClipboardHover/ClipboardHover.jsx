import Button from '../Button';
import Icon from '../Icon';

import "./ClipboardHover.scss";

const ClipboardHover = ({ children }) => {

  const text = React.createRef();

  const handleClick = (e) => {
    const el = text.current;
    const value = el.textContent;

    // For input texts
    // const el = e.target;
    // el.select();
    // el.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(value);
  };

  return (
    <div className='soda-clipboard_hover'>
      <div className='clipboard_hover-text' ref={text}>
        {children}
      </div>
      <div className='clipboard_hover-icon'>
        <Button tiny onClick={handleClick}>
          <Icon type='list.clipboard' />
        </Button>
      </div>
    </div>
  );
};

export default ClipboardHover;