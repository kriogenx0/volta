// Props that make a non-button element (a <div> that has to hold other content)
// work as a button for the keyboard and for assistive technology: a role, a tab
// stop, and Enter or Space to activate it, as well as the click.
//
//   <div className="box" {...asButton(chooseFile)}>...</div>
//
// Prefer a real <button> where the markup allows it. A key pressed on something
// inside the element (an input, say) is left alone: only the element itself
// reacts to Enter and Space.
export const asButton = (onActivate) => ({
  role: 'button',
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate(event);
    }
  }
});

export default asButton;
