import { GAP, placePanel } from '../../components/Dropdown/placement';

// A 768px-tall window; the trigger is 30px tall.
const place = (triggerTop, panelHeight, viewportHeight = 768) => placePanel({
  triggerTop,
  triggerBottom: triggerTop + 30,
  panelHeight,
  viewportHeight
});

describe('placePanel', () => {
  it('puts the panel below when it fits', () => {
    expect(place(100, 200)).toBe('below');
  });

  it('puts it above when it does not fit below and there is more room above', () => {
    expect(place(700, 200)).toBe('above');
  });

  it('keeps it below when it does not fit above either and below has more room', () => {
    expect(place(100, 2000)).toBe('below');
  });

  it('goes on the side with more room when it fits neither', () => {
    expect(place(500, 2000)).toBe('above');
    expect(place(200, 2000)).toBe('below');
  });

  it('counts the gap between the trigger and the panel', () => {
    const fitsExactly = 768 - 130 - GAP;
    expect(place(100, fitsExactly)).toBe('below');
    expect(place(500, 768 - 530 - GAP + 1)).toBe('above');
  });
});
