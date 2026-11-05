import React from 'react';
import PropTypes from 'prop-types';

import './Avatar.scss';

// Up to two initials from the first two words of the name. A missing or blank
// name gives no initials rather than throwing.
const initials = (name) => (name || '')
  .split(/\s+/)
  .filter(Boolean)
  .map((part) => Array.from(part)[0])
  .slice(0, 2)
  .join('')
  .toUpperCase();

// The photo and the initials are named after the person, so a lone avatar still
// says who it is.
const Avatar = ({ name, photoUrl, size = 'md' }) => photoUrl
  ? <img src={photoUrl} alt={name || ''} className={`volta-avatar volta-avatar--${size}`} />
  : (
    <div
      className={`volta-avatar volta-avatar--${size} volta-avatar--initials`}
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
    >
      {initials(name)}
    </div>
  );

Avatar.sizes = ['sm', 'md'];

Avatar.propTypes = {
  // Shown as initials when there is no photo
  name: PropTypes.string,
  photoUrl: PropTypes.string,
  size: PropTypes.oneOf(Avatar.sizes)
};

export { Avatar };
export default Avatar;
