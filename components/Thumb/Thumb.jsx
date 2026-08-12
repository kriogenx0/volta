import PropTypes from 'prop-types';

import './Thumb.scss';

const Thumb = ({ src, alt, size = 56 }) => {
  const style = { width: size, height: size };

  if (src) {
    return <img className='volta-thumb' style={style} src={src} alt={alt} />;
  }

  return (
    <div className='volta-thumb volta-thumb-placeholder' style={style}>
      <svg viewBox='0 0 24 24' width='40%' height='40%' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <rect x='3' y='5' width='18' height='14' rx='2' />
        <circle cx='9' cy='10' r='1.75' />
        <path d='M3 16l5-4 4 3 4-3 5 4' />
      </svg>
    </div>
  );
};

Thumb.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default Thumb;
