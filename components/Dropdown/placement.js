// Where a dropdown's panel goes relative to its trigger.

// The space between the trigger and the panel, in px (matches the stylesheet).
export const GAP = 4;

// 'below' unless the panel doesn't fit below the trigger and there is more room
// above it; when it fits nowhere it goes on the side with more room. Distances
// are in px, measured from the top of the viewport.
export const placePanel = ({ triggerTop, triggerBottom, panelHeight, viewportHeight }) => {
  const roomBelow = viewportHeight - triggerBottom - GAP;
  const roomAbove = triggerTop - GAP;
  return panelHeight > roomBelow && roomAbove > roomBelow ? 'above' : 'below';
};
