import Avatar from '../../components/Avatar/Avatar';

// A small drawn portrait standing in for a real photo URL, so the example needs
// no network.
const PORTRAIT = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">'
  + '<rect width="72" height="72" fill="#9db7d5"/>'
  + '<circle cx="36" cy="28" r="13" fill="#f2d3b8"/>'
  + '<path d="M10 72c0-17 11-27 26-27s26 10 26 27z" fill="#2f4a6d"/>'
  + '</svg>'
)}`;

export default {
  name: 'Avatar',
  description: 'A round picture of a person: their photo when there is one, otherwise up to two initials taken from their name. Comes in a small and a medium size. The background is made from the name by default, so a person is the same colour everywhere; color="accent" or any CSS colour overrides it.',
  examples: [
    {
      name: 'Initials',
      code: `<Avatar name="Ada Lovelace" />
<Avatar name="Grace Brewster Murray Hopper" />
<Avatar name="Plato" />`,
      output: (
        <div className="example-stack">
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Brewster Murray Hopper" />
          <Avatar name="Plato" />
        </div>
      )
    },
    {
      name: 'Photo',
      code: '<Avatar name="Grace Hopper" photoUrl={photoUrl} />',
      output: <Avatar name="Grace Hopper" photoUrl={PORTRAIT} />
    },
    {
      name: 'Sizes',
      code: `<Avatar name="Ada Lovelace" size="sm" />
<Avatar name="Ada Lovelace" size="md" />
<Avatar name="Grace Hopper" photoUrl={photoUrl} size="sm" />
<Avatar name="Grace Hopper" photoUrl={photoUrl} size="md" />`,
      output: (
        <div className="example-stack">
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Ada Lovelace" size="md" />
          <Avatar name="Grace Hopper" photoUrl={PORTRAIT} size="sm" />
          <Avatar name="Grace Hopper" photoUrl={PORTRAIT} size="md" />
        </div>
      )
    },
    {
      name: 'Missing name',
      code: '<Avatar />',
      output: (
        <div className="example-stack">
          <p>With no name and no photo the avatar is an empty accent-coloured circle (there is no name to make a colour from).</p>
          <Avatar />
        </div>
      )
    },
    {
      name: 'A colour from the name (the default)',
      code: `<Avatar name="Ada Lovelace" />
<Avatar name="Grace Hopper" />
<Avatar name="Alan Turing" />
<Avatar name="Katherine Johnson" />
<Avatar name="Linus Torvalds" />`,
      output: (
        <div className="example-row">
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Alan Turing" />
          <Avatar name="Katherine Johnson" />
          <Avatar name="Linus Torvalds" />
        </div>
      )
    },
    {
      name: 'The theme accent',
      code: '<Avatar name="Ada Lovelace" color="accent" />',
      output: <Avatar name="Ada Lovelace" color="accent" />
    },
    {
      name: 'Your own colour',
      code: '<Avatar name="Ada Lovelace" color="#9060F0" />',
      output: <Avatar name="Ada Lovelace" color="#9060F0" />
    }
  ]
};
