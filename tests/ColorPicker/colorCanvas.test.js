import { drawHues, drawSquare, hsvToRgb } from '../../components/ColorPicker/colorCanvas';

// A canvas whose context keeps the pixels it is given
const fakeCanvas = (width, height) => {
  const painted = {};
  return {
    width,
    height,
    painted,
    getContext: () => ({
      createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
      putImageData: (image) => { painted.data = image.data; }
    })
  };
};

const pixel = (canvas, x, y) => [...canvas.painted.data.slice((y * canvas.width + x) * 4, (y * canvas.width + x) * 4 + 4)];

describe('hsvToRgb', () => {
  it('converts the primary hues and the greys', () => {
    expect(hsvToRgb(0, 1, 1)).toEqual([255, 0, 0]);
    expect(hsvToRgb(120, 1, 1)).toEqual([0, 255, 0]);
    expect(hsvToRgb(240, 1, 1)).toEqual([0, 0, 255]);
    expect(hsvToRgb(60, 1, 1)).toEqual([255, 255, 0]);
    expect(hsvToRgb(200, 0, 1)).toEqual([255, 255, 255]);
    expect(hsvToRgb(200, 1, 0)).toEqual([0, 0, 0]);
  });

  it('wraps hues outside 0-360', () => {
    expect(hsvToRgb(360, 1, 1)).toEqual([255, 0, 0]);
    expect(hsvToRgb(-120, 1, 1)).toEqual([0, 0, 255]);
  });
});

describe('drawSquare', () => {
  it('paints white at the top left, the hue at the top right and black along the bottom', () => {
    const canvas = fakeCanvas(10, 10);
    drawSquare(canvas, 120);
    expect(pixel(canvas, 0, 0)).toEqual([255, 255, 255, 255]);
    expect(pixel(canvas, 9, 0)).toEqual([0, 255, 0, 255]);
    expect(pixel(canvas, 0, 9)).toEqual([0, 0, 0, 255]);
    expect(pixel(canvas, 9, 9)).toEqual([0, 0, 0, 255]);
  });
});

describe('drawHues', () => {
  it('paints the rainbow from red through green and blue', () => {
    const canvas = fakeCanvas(361, 1);
    drawHues(canvas);
    expect(pixel(canvas, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(canvas, 120, 0)).toEqual([0, 255, 0, 255]);
    expect(pixel(canvas, 240, 0)).toEqual([0, 0, 255, 255]);
  });
});

describe('without a canvas', () => {
  it('does nothing when there is no drawing context', () => {
    expect(() => drawSquare({ width: 2, height: 2, getContext: () => null }, 0)).not.toThrow();
    expect(() => drawHues(null)).not.toThrow();
  });
});
