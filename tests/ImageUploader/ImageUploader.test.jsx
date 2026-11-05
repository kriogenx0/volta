import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ImageUploader from '../../components/ImageUploader/ImageUploader';

const photo = new File(['contents'], 'photo.png', { type: 'image/png' });

const renderUploader = (props = {}) => render(
  <ImageUploader cropWidth={300} cropHeight={200} onImagePick={() => {}} {...props}>
    <button type="button">Choose image</button>
  </ImageUploader>
);

// ImageUploader opens the picker with `input.click()` on an <input type="file">
// it never attaches to the page. Replace click so tests can see each input it
// opens and answer it with a file.
let pickers;

beforeEach(() => {
  pickers = [];
  jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function () {
    pickers.push(this);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const choose = (file, picker = pickers[pickers.length - 1]) => {
  Object.defineProperty(picker, 'files', { value: [file], configurable: true });
  fireEvent.change(picker);
};

const open = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Choose image' }));
  choose(photo);
};

describe('ImageUploader', () => {
  it('renders its children as the thing to click', () => {
    renderUploader();
    expect(screen.getByRole('button', { name: 'Choose image' })).toBeInTheDocument();
  });

  it('adds a className to the clickable wrapper', () => {
    renderUploader({ className: 'avatar_picker' });
    const wrapper = screen.getByRole('button', { name: 'Choose image' }).parentElement;
    expect(wrapper).toHaveClass('volta-image_uploader', 'avatar_picker');
  });

  it('opens a file picker limited to images when the children are clicked', () => {
    renderUploader();
    fireEvent.click(screen.getByRole('button', { name: 'Choose image' }));
    expect(pickers).toHaveLength(1);
    expect(pickers[0].type).toBe('file');
    expect(pickers[0].accept).toBe('image/*');
    expect(pickers[0].multiple).toBe(false);
  });

  it('shows no cropper until a file is chosen', () => {
    renderUploader();
    fireEvent.click(screen.getByRole('button', { name: 'Choose image' }));
    expect(screen.queryByText('Position and Size Image')).toBeNull();
  });

  it('opens the file picker without a click when shouldPick is true', () => {
    renderUploader({ shouldPick: true });
    expect(pickers).toHaveLength(1);
  });

  it('does not open the picker on its own when shouldPick is false', () => {
    renderUploader({ shouldPick: false });
    expect(pickers).toHaveLength(0);
  });

  it('shows the cropper, sized to the crop dimensions, once a file is chosen', () => {
    renderUploader({ cropWidth: 300, cropHeight: 200, bleedWidth: 20 });
    open();
    expect(screen.getByText('Position and Size Image')).toBeInTheDocument();
    expect(screen.getByAltText('Image being cropped')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Scale' })).toBeInTheDocument();
    const frame = document.querySelector('.icr_frame');
    expect(frame).toHaveStyle({ width: '300px', height: '200px' });
  });

  it('renders the cropper in a layer outside the clickable wrapper', () => {
    renderUploader();
    open();
    const wrapper = document.querySelector('.volta-image_uploader');
    expect(wrapper).not.toContainElement(screen.getByText('Position and Size Image'));
  });

  // React events bubble through portals. When the cropper was rendered inside
  // the clickable wrapper, every click in it re-ran the file picker.
  it('does not reopen the file picker when clicking inside the cropper', () => {
    renderUploader();
    open();
    expect(pickers).toHaveLength(1);

    fireEvent.click(screen.getByText('Position and Size Image'));
    fireEvent.click(screen.getByRole('slider', { name: 'Scale' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(pickers).toHaveLength(1);
  });

  it('closes the cropper without calling onImagePick when cancelled', async () => {
    const onImagePick = jest.fn();
    renderUploader({ onImagePick });
    open();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByText('Position and Size Image')).toBeNull());
    expect(onImagePick).not.toHaveBeenCalled();
  });

  it('can pick again after cancelling', async () => {
    renderUploader();
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByText('Position and Size Image')).toBeNull());

    fireEvent.click(screen.getByRole('button', { name: 'Choose image' }));
    expect(pickers).toHaveLength(2);
  });

  describe('cropping', () => {
    let blob;

    beforeEach(() => {
      blob = new Blob(['jpeg'], { type: 'image/jpeg' });
      // jsdom has no canvas. Give the cropper a drawing surface and a JPEG blob.
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
        clearRect: () => {},
        fillRect: () => {},
        drawImage: () => {}
      });
      jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(blob));
    });

    it('hands the cropped image to onImagePick and closes the cropper', async () => {
      const onImagePick = jest.fn();
      renderUploader({ onImagePick });
      open();

      fireEvent.click(screen.getByRole('button', { name: 'Crop and Save' }));

      await waitFor(() => expect(onImagePick).toHaveBeenCalledTimes(1));
      const [pickedBlob, url] = onImagePick.mock.calls[0];
      expect(pickedBlob).toBe(blob);
      expect(pickedBlob.filename).toBe('photo.jpg');
      expect(typeof url).toBe('string');
      await waitFor(() => expect(screen.queryByText('Position and Size Image')).toBeNull());
      expect(pickers).toHaveLength(1);
    });
  });
});
