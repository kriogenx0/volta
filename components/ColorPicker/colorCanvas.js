// Draws the custom ColorPicker's colour areas on a canvas, one pixel per colour:
// the saturation and brightness square for a hue, and the strip of hues. The
// canvases are small (the CSS scales them to the control), so a redraw while
// dragging the hue is about 10,000 pixels.

// h in degrees (0-360), s and v from 0 to 1; returns [r, g, b] from 0 to 255
export const hsvToRgb = (h, s, v) => {
  const hue = ((h % 360) + 360) % 360 / 60;
  const c = v * s;
  const x = c * (1 - Math.abs((hue % 2) - 1));
  const m = v - c;
  const sector = Math.floor(hue);
  const [r, g, b] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][sector % 6];
  return [r, g, b].map((channel) => Math.round((channel + m) * 255));
};

const contextOf = (canvas) => (canvas && canvas.getContext ? canvas.getContext('2d') : null);

// Fills the canvas with a colour for each pixel, from fn(x, y) -> [r, g, b]
const paint = (canvas, fn) => {
  const context = contextOf(canvas);
  if (!context) return;
  const { width, height } = canvas;
  const image = context.createImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = fn(x, y);
      const i = (y * width + x) * 4;
      image.data[i] = r;
      image.data[i + 1] = g;
      image.data[i + 2] = b;
      image.data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
};

// Saturation grows to the right and brightness upward, for the given hue
export const drawSquare = (canvas, hue) => {
  if (!canvas) return;
  const { width, height } = canvas;
  paint(canvas, (x, y) => hsvToRgb(hue, x / Math.max(width - 1, 1), 1 - y / Math.max(height - 1, 1)));
};

// Every hue from 0 to 360 across the width, fully saturated and bright
export const drawHues = (canvas) => {
  if (!canvas) return;
  const { width } = canvas;
  paint(canvas, (x) => hsvToRgb((x / Math.max(width - 1, 1)) * 360, 1, 1));
};
