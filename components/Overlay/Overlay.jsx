import ReactDOM from 'react-dom';

import './Overlay.scss';

const Overlay = ({ showing, onClick, children }) => {
  const buildOverlay = () => {
    if (Overlay.overlay) return;

    Overlay.overlay = document.createElement('div');
    Overlay.overlay.className = Overlay.defaultClassName + ' showing';
    document.body.appendChild(Overlay.overlay);

    if (onClick) {
      Overlay.overlay.addEventListener('click', onClick);
    }
  }

  const removeOverlay = () => {
    if (Overlay.overlay) {
      Overlay.overlay.className = Overlay.defaultClassName;
      ReactDOM.unmountComponentAtNode(Overlay.overlay);
      document.body.removeChild(Overlay.overlay);
      Overlay.overlay = null;
    }
  }

  showing ? buildOverlay() : removeOverlay();

  return null;
};

Overlay.defaultClassName = 'soda-overlay';

Overlay.defaultProps = {
  showing: null
};

export default Overlay;
