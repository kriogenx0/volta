import { render, screen, fireEvent, act, within } from '@testing-library/react';

import ImageCrop from '../../components/ImageCrop/ImageCrop';
import examples from '../../examples/ImageCrop/ImageCrop-examples';

beforeAll(() => {
  global.URL.createObjectURL = global.URL.createObjectURL || (() => 'blob:mock');
});

const renderCrop = (props = {}) => {
  const image = new File(['contents'], 'photo.png', { type: 'image/png' });
  return render(
    <ImageCrop image={image} width={300} height={200} onCrop={() => {}} onClose={() => {}} {...props} />
  );
};

describe('ImageCrop', () => {
  it('renders without crashing', () => {
    const { container } = renderCrop();
    expect(container).toBeInTheDocument();
  });

  it('describes the image being cropped', () => {
    const { getByAltText } = renderCrop();
    expect(getByAltText('Image being cropped')).toBeInTheDocument();
  });

  it('omits the scale slider by default', () => {
    renderCrop();
    expect(screen.queryByRole('slider')).toBeNull();
  });

  it('shows the scale slider when showScale is set', () => {
    renderCrop({ showScale: true });
    expect(screen.getByRole('slider', { name: 'Scale' })).toBeInTheDocument();
  });

  describe('without the optional props', () => {
    let consoleError;

    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it('is 300 by 300 with no size given, and styles are valid numbers', () => {
      const image = new File(['contents'], 'photo.png', { type: 'image/png' });
      const { container } = render(<ImageCrop image={image} />);
      expect(container.querySelector('.icr_frame')).toHaveStyle({ width: '300px', height: '300px' });
      expect(container.querySelector('canvas')).toHaveAttribute('width', '300');
      expect(consoleError).not.toHaveBeenCalled();
    });

    it('closes and crops without onClose or onCrop', () => {
      jest.useFakeTimers();
      try {
        const image = new File(['contents'], 'photo.png', { type: 'image/png' });
        render(<ImageCrop image={image} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(() => act(() => { jest.advanceTimersByTime(300); })).not.toThrow();
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('as a dialog', () => {
    it('is a modal dialog with a name', () => {
      renderCrop();
      expect(screen.getByRole('dialog', { name: 'Position and size image' })).toHaveAttribute('aria-modal', 'true');
    });

    it('fades in after mounting', () => {
      jest.useFakeTimers();
      try {
        const { container } = renderCrop();
        expect(container.querySelector('.volta-image_crop')).not.toHaveClass('is_visible');
        act(() => { jest.advanceTimersByTime(150); });
        expect(container.querySelector('.volta-image_crop')).toHaveClass('is_visible');
      } finally {
        jest.useRealTimers();
      }
    });

    it('locks page scrolling while open and releases it on unmount', () => {
      const { unmount } = renderCrop();
      expect(document.body).toHaveClass('is_overlay-visible');
      unmount();
      expect(document.body).not.toHaveClass('is_overlay-visible');
    });

    it('creates an object URL for the image and revokes it on unmount', () => {
      const create = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:photo');
      const revoke = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      const image = new File(['contents'], 'photo.png', { type: 'image/png' });
      const { unmount } = render(<ImageCrop image={image} width={300} height={200} />);
      expect(create).toHaveBeenCalledWith(image);
      expect(screen.getByAltText('Image being cropped')).toHaveAttribute('src', 'blob:photo');
      unmount();
      expect(revoke).toHaveBeenCalledWith('blob:photo');
      create.mockRestore();
      revoke.mockRestore();
    });

    describe('closing', () => {
      beforeEach(() => jest.useFakeTimers());
      afterEach(() => jest.useRealTimers());

      it.each([['Cancel'], ['Close']])('the %s button fades out, then calls onClose', (name) => {
        const onClose = jest.fn();
        renderCrop({ onClose });
        fireEvent.click(screen.getByRole('button', { name }));
        expect(onClose).not.toHaveBeenCalled();
        act(() => { jest.advanceTimersByTime(200); });
        expect(onClose).toHaveBeenCalledTimes(1);
      });

      it('does not call onClose after it has been removed', () => {
        const onClose = jest.fn();
        const { unmount } = renderCrop({ onClose });
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        unmount();
        act(() => { jest.advanceTimersByTime(500); });
        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('layout', () => {
    it('sizes the frame and the control bar from width and height', () => {
      const { container } = renderCrop({ width: 500, height: 320 });
      expect(container.querySelector('.icr_frame')).toHaveStyle({ width: '500px', height: '320px' });
      expect(container.querySelector('.icr_control')).toHaveStyle({ width: '500px' });
      expect(container.querySelector('canvas')).toHaveAttribute('width', '500');
      expect(container.querySelector('canvas')).toHaveAttribute('height', '320');
      expect(container.querySelector('.volta-image_crop')).not.toHaveClass('is_small');
    });

    it('uses the compact layout under 400px and keeps the controls 300px wide', () => {
      const { container } = renderCrop({ width: 160, height: 160 });
      expect(container.querySelector('.volta-image_crop')).toHaveClass('is_small');
      expect(container.querySelector('.icr_control')).toHaveStyle({ width: '300px' });
    });

    it('dims a bleed border around the crop area', () => {
      const { container } = renderCrop({ bleedWidth: 24 });
      expect(container.querySelector('.icr_screen')).toHaveStyle({ borderWidth: '24px' });
    });
  });

  describe('with a loaded image', () => {
    const images = [];
    let RealImage;
    let context;
    let blob;

    // jsdom never decodes images, so stand in for `new Image()` and fire its
    // load event with a size ourselves.
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

      context = { clearRect: jest.fn(), fillRect: jest.fn(), drawImage: jest.fn(), fillStyle: '' };
      blob = new Blob(['jpg'], { type: 'image/jpeg' });
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
      jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(blob));
    });

    afterEach(() => {
      window.Image = RealImage;
      jest.restoreAllMocks();
    });

    const loadImage = () => act(() => { images[0].dispatchEvent(new Event('load')); });
    const imageBox = () => document.querySelector('.icr_image');

    it('shrinks a large picture to fit and centers it', () => {
      renderCrop({ width: 300, height: 200 });
      loadImage();
      // 800x400 into 300x200: scaled to 0.5, 400x200, centered across the width
      expect(imageBox()).toHaveStyle({ width: '400px', height: '200px', left: '-50px', top: '0px' });
    });

    it('centers a small picture without growing it', () => {
      renderCrop({ width: 300, height: 200 });
      images[0].width = 100;
      images[0].height = 100;
      loadImage();
      expect(imageBox()).toHaveStyle({ width: '100px', height: '100px', left: '100px', top: '50px' });
    });

    it('drags the picture and keeps it over the crop area', () => {
      const { container } = renderCrop({ width: 300, height: 200 });
      loadImage();
      const screenEl = container.querySelector('.icr_screen');

      fireEvent.mouseDown(screenEl, { button: 0, clientX: 100, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 60, clientY: 100 });
      expect(imageBox()).toHaveStyle({ left: '-90px' });

      // The right edge would leave the frame, so it stops at -100
      fireEvent.mouseMove(document, { clientX: 0, clientY: 100 });
      expect(imageBox()).toHaveStyle({ left: '-100px' });
      // and the left edge stops at 0
      fireEvent.mouseMove(document, { clientX: 400, clientY: 100 });
      expect(imageBox()).toHaveStyle({ left: '0px' });

      fireEvent.mouseUp(document);
      fireEvent.mouseMove(document, { clientX: 0, clientY: 100 });
      expect(imageBox()).toHaveStyle({ left: '0px' });
    });

    it('only drags with the left mouse button', () => {
      const { container } = renderCrop({ width: 300, height: 200 });
      loadImage();
      fireEvent.mouseDown(container.querySelector('.icr_screen'), { button: 2, clientX: 100, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 60, clientY: 100 });
      expect(imageBox()).toHaveStyle({ left: '-50px' });
    });

    it('stops listening to the mouse when removed mid-drag', () => {
      const removeListener = jest.spyOn(document, 'removeEventListener');
      const { container, unmount } = renderCrop({ width: 300, height: 200 });
      loadImage();
      fireEvent.mouseDown(container.querySelector('.icr_screen'), { button: 0, clientX: 100, clientY: 100 });
      unmount();
      const removed = removeListener.mock.calls.map(([type]) => type);
      expect(removed).toEqual(expect.arrayContaining(['mousemove', 'mouseup']));
    });

    it('centers the picture again from the center button', () => {
      const { container } = renderCrop({ width: 300, height: 200 });
      loadImage();
      fireEvent.mouseDown(container.querySelector('.icr_screen'), { button: 0, clientX: 100, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 160, clientY: 100 });
      fireEvent.mouseUp(document);
      expect(imageBox()).toHaveStyle({ left: '0px' });

      fireEvent.click(screen.getByRole('button', { name: 'Center image in the crop area' }));
      expect(imageBox()).toHaveStyle({ left: '-50px' });
    });

    it('shows the original size from the size button', () => {
      renderCrop({ width: 300, height: 200 });
      loadImage();
      fireEvent.click(screen.getByRole('button', { name: 'Show original size' }));
      expect(imageBox()).toHaveStyle({ width: '800px', height: '400px' });
    });

    it('scales the picture with the slider', () => {
      renderCrop({ width: 300, height: 200, showScale: true });
      loadImage();
      fireEvent.keyDown(screen.getByRole('slider', { name: 'Scale' }), { key: 'End' });
      // Slider tops out at 2x
      expect(imageBox()).toHaveStyle({ width: '1600px', height: '800px' });
    });

    describe('Crop and Save', () => {
      beforeEach(() => jest.useFakeTimers());
      afterEach(() => jest.useRealTimers());

      it('draws the picture where it sits on a white canvas and hands over a jpg named after the original', () => {
        const onCrop = jest.fn();
        const onClose = jest.fn();
        renderCrop({ width: 300, height: 200, onCrop, onClose });
        loadImage();
        fireEvent.click(screen.getByRole('button', { name: 'Crop and Save' }));

        expect(context.fillStyle).toBe('white');
        expect(context.fillRect).toHaveBeenCalledWith(0, 0, 300, 200);
        expect(context.drawImage).toHaveBeenCalledWith(images[0], -50, 0, 400, 200);
        expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.95);
        expect(onCrop).toHaveBeenCalledWith(blob);
        expect(blob.filename).toBe('photo.jpg');

        // and the cropper closes
        act(() => { jest.advanceTimersByTime(200); });
        expect(onClose).toHaveBeenCalledTimes(1);
      });

      it.each([
        ['holiday.photo.png', 'holiday.photo.jpg'],
        ['scan', 'scan.jpg'],
        ['IMG_0001.JPEG', 'IMG_0001.jpg']
      ])('names the result for %s as %s', (filename, expected) => {
        const onCrop = jest.fn();
        const image = new File(['contents'], filename, { type: 'image/png' });
        render(<ImageCrop image={image} width={300} height={200} onCrop={onCrop} />);
        fireEvent.click(screen.getByRole('button', { name: 'Crop and Save' }));
        expect(blob.filename).toBe(expected);
      });

      it('does nothing with a canvas that could not be turned into a file', () => {
        HTMLCanvasElement.prototype.toBlob.mockImplementation((callback) => callback(null));
        const onCrop = jest.fn();
        renderCrop({ onCrop });
        expect(() => fireEvent.click(screen.getByRole('button', { name: 'Crop and Save' }))).not.toThrow();
        expect(onCrop).not.toHaveBeenCalled();
      });
    });
  });

  describe('styleguide examples', () => {
    it('open the cropper from a button and not before', () => {
      examples.examples.forEach((example) => {
        const { unmount } = render(example.output);
        expect(screen.queryByRole('dialog')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: /^Open/ }));
        const dialog = screen.getByRole('dialog', { name: 'Position and size image' });
        expect(within(dialog).getByAltText('Image being cropped')).toBeInTheDocument();
        unmount();
      });
    });

    it('go back to the button after Cancel', () => {
      jest.useFakeTimers();
      try {
        render(examples.examples[0].output);
        fireEvent.click(screen.getByRole('button', { name: 'Open cropper' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        act(() => { jest.advanceTimersByTime(200); });
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(screen.getByText('Nothing cropped yet.')).toBeInTheDocument();
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
