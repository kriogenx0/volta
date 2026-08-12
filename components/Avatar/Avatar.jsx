import React from 'react';

const SIZE_CLASS = { sm: 'h-7 w-7 text-[0.65rem]', md: 'h-9 w-9 text-xs' };
const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const Avatar = ({ name, photoUrl, size = 'md' }) => photoUrl
  ? <img src={photoUrl} alt="" className={`volta-avatar ${SIZE_CLASS[size]} shrink-0 rounded-full object-cover`} />
  : <div className={`volta-avatar flex ${SIZE_CLASS[size]} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lilac to-lavender font-semibold text-white`}>{initials(name)}</div>;

export { Avatar };
export default Avatar;
