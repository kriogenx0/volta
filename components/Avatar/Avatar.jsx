import React from 'react';

import './Avatar.scss';

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const Avatar = ({ name, photoUrl, size = 'md' }) => photoUrl
  ? <img src={photoUrl} alt="" className={`volta-avatar volta-avatar--${size}`} />
  : <div className={`volta-avatar volta-avatar--${size} volta-avatar--initials`}>{initials(name)}</div>;

export { Avatar };
export default Avatar;
