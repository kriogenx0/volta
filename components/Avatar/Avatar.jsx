import React from 'react';
import PropTypes from 'prop-types';

import { avatarColors } from './avatarColor';

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
//
// `color` is the background of the initials: 'auto' (a colour made from the name, the same
// for the same name everywhere; the default), 'accent' (the theme's accent, also what a blank
// name gets), or any CSS colour. It is passed on as custom properties, since the value is worked out at runtime.
const Avatar = ({ name, photoUrl, size = 'md', color = 'auto' }) => {
  if (photoUrl) return <img src={photoUrl} alt={name || ''} className={`volta-avatar volta-avatar--${size}`} />;

  const colors = avatarColors(color, name);
  return (
    <div
      className={`volta-avatar volta-avatar--${size} volta-avatar--initials`}
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
      style={colors ? { '--volta-avatar-background': colors.background, '--volta-avatar-color': colors.text } : undefined}
    >
      {initials(name)}
    </div>
  );
};

Avatar.sizes = ['sm', 'md'];

Avatar.propTypes = {
  // Shown as initials when there is no photo
  name: PropTypes.string,
  photoUrl: PropTypes.string,
  size: PropTypes.oneOf(Avatar.sizes),
  // 'accent', 'auto' (from the name), or a CSS colour
  color: PropTypes.string
};

export { Avatar };
export default Avatar;
