// What the hooks version of ImageCrop must do across renders: its listeners and timers
// outlive a render, so they have to see the latest props, and a new picture replaces the old one.
import { render, screen, fireEvent, act } from '@testing-library/react';

import ImageCrop from '../../components/ImageCrop/ImageCrop';

const file = (name = 'photo.png') => new File(['contents'], name, { type: 'image/png' });

describe('ImageCrop across renders', () => {
  const images = [];
  let RealImage;

  // jsdom never decodes images, so stand in for `new Image()` and fire its load event ourselves.
  beforeEach(() => {
    RealImage = window.Image;
    images.length = 0;
    window.Image = class FakeImage extends EventTarget {
      constructor() {
        super();
        this.width = 800;
        this.height = 400;
        images.push(this);
      }
    };
    jest.spyOn(URL, 'createObjectURL').mockImplementation((blob) => `blob:${blob.name}`);
    jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    window.Image = RealImage;
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  const loadImage = () => act(() => { images[0].dispatchEvent(new Event('load')); });
  const imageBox = () => document.querySelector('.icr_image');

  it('centers a picture that loads after the size changed using the new size', () => {
    const image = file();
    const { rerender } = render(<ImageCrop image={image} width={300} height={200} />);
    rerender(<ImageCrop image={image} width={360} height={200} />);
    loadImage();
    // 800x400 into 360x200 is scaled to 0.5, 400x200, centered across 360 (it would be -50 across 300)
    expect(imageBox()).toHaveStyle({ width: '400px', height: '200px', left: '-20px', top: '0px' });
  });

  it('calls the onClose it has now, not the one it had when Cancel was clicked', () => {
    jest.useFakeTimers();
    const first = jest.fn();
    const second = jest.fn();
    const image = file();
    const { rerender } = render(<ImageCrop image={image} onClose={first} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    rerender(<ImageCrop image={image} onClose={second} />);
    act(() => { jest.advanceTimersByTime(200); });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('shows a new picture from a new object URL and releases the old one', () => {
    const { rerender } = render(<ImageCrop image={file('one.png')} />);
    expect(imageBox()).toHaveAttribute('src', 'blob:one.png');

    rerender(<ImageCrop image={file('two.png')} />);

    expect(imageBox()).toHaveAttribute('src', 'blob:two.png');
    expect(images[0].src).toBe('blob:two.png');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:one.png');
    expect(URL.revokeObjectURL).not.toHaveBeenCalledWith('blob:two.png');
  });

  it('names the result after the picture it has now', () => {
    const blob = new Blob(['jpg'], { type: 'image/jpeg' });
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect() {}, fillRect() {}, drawImage() {} });
    jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(blob));
    const onCrop = jest.fn();
    const { rerender } = render(<ImageCrop image={file('one.png')} onCrop={onCrop} />);
    rerender(<ImageCrop image={file('two.png')} onCrop={onCrop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Crop and Save' }));
    expect(blob.filename).toBe('two.jpg');
  });

  it('keeps one picture and one load listener across renders', () => {
    const image = file();
    const { rerender } = render(<ImageCrop image={image} />);
    rerender(<ImageCrop image={image} width={320} />);
    rerender(<ImageCrop image={image} width={340} />);
    expect(images).toHaveLength(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
});
