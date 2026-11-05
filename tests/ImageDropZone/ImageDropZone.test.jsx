import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ImageDropZone from '../../components/ImageDropZone/ImageDropZone';

const IMAGE = new File(['pixels'], 'photo.png', { type: 'image/png' });

const dropOn = (element, files) => fireEvent.drop(element, { dataTransfer: { files } });

describe('ImageDropZone', () => {
  let pickers;

  beforeEach(() => {
    // The zone opens a detached <input type="file">; catch it instead of a real dialog
    pickers = [];
    jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function click() {
      pickers.push(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const chooseFile = (files) => {
    const input = pickers[pickers.length - 1];
    Object.defineProperty(input, 'files', { value: files, configurable: true });
    fireEvent.change(input);
  };

  it('renders without crashing', () => {
    const { container } = render(<ImageDropZone />);
    expect(container).toBeInTheDocument();
  });

  describe('defaults', () => {
    it('is 300px tall', () => {
      const { container } = render(<ImageDropZone />);
      expect(container.querySelector('.image_background')).toHaveStyle({ height: '300px' });
    });

    it('takes its height from the prop', () => {
      const { container } = render(<ImageDropZone height={120} />);
      expect(container.querySelector('.image_background')).toHaveStyle({ height: '120px' });
    });

    it('does not put the word "null" or "undefined" in the class', () => {
      render(<ImageDropZone />);
      expect(screen.getByRole('button').className).toBe('volta-image_drop_zone');
    });

    it('adds the class it is given', () => {
      render(<ImageDropZone className="banner" />);
      expect(screen.getByRole('button')).toHaveClass('volta-image_drop_zone', 'banner');
    });

    it('hints at what to do while it has no image', () => {
      render(<ImageDropZone />);
      expect(screen.getByRole('button', { name: 'Click or drop an image' })).toBeInTheDocument();
    });
  });

  describe('default image', () => {
    it('shows the image and drops the hint', () => {
      const { container } = render(<ImageDropZone defaultImageUrl="/photo.png" />);
      expect(container.querySelector('.image_background').style.backgroundImage).toContain('/photo.png');
      expect(screen.queryByText('Click or drop an image')).toBeNull();
      expect(screen.getByRole('button', { name: 'Change image' })).toBeInTheDocument();
    });

    it('shows an image that arrives after the first render', () => {
      const { container, rerender } = render(<ImageDropZone />);
      rerender(<ImageDropZone defaultImageUrl="/later.png" />);
      expect(container.querySelector('.image_background').style.backgroundImage).toContain('/later.png');
    });
  });

  describe('choosing a file', () => {
    it('opens a file picker for images on click', () => {
      render(<ImageDropZone />);
      fireEvent.click(screen.getByRole('button'));
      expect(pickers).toHaveLength(1);
      expect(pickers[0].type).toBe('file');
      expect(pickers[0].accept).toBe('image/*');
      expect(pickers[0].multiple).toBe(false);
    });

    it('calls onChange with the file and its data URL, and shows it', async () => {
      const onChange = jest.fn();
      const { container } = render(<ImageDropZone onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      chooseFile([IMAGE]);

      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
      expect(onChange.mock.calls[0][0]).toBe(IMAGE);
      expect(onChange.mock.calls[0][1]).toMatch(/^data:image\/png;base64,/);
      await waitFor(() => {
        expect(container.querySelector('.image_background').style.backgroundImage).toContain('data:image/png');
      });
      expect(screen.queryByText('Click or drop an image')).toBeNull();
    });

    it('works without an onChange', async () => {
      const { container } = render(<ImageDropZone />);
      fireEvent.click(screen.getByRole('button'));
      chooseFile([IMAGE]);
      await waitFor(() => {
        expect(container.querySelector('.image_background').style.backgroundImage).toContain('data:image/png');
      });
    });

    it('ignores a picker closed with nothing chosen', () => {
      const onChange = jest.fn();
      render(<ImageDropZone onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      expect(() => chooseFile([])).not.toThrow();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('keeps a chosen image when the default image prop changes', async () => {
      const { container, rerender } = render(<ImageDropZone defaultImageUrl="/first.png" />);
      fireEvent.click(screen.getByRole('button'));
      chooseFile([IMAGE]);
      await waitFor(() => {
        expect(container.querySelector('.image_background').style.backgroundImage).toContain('data:image/png');
      });
      rerender(<ImageDropZone defaultImageUrl="/second.png" />);
      expect(container.querySelector('.image_background').style.backgroundImage).toContain('data:image/png');
    });

    it('opens the picker on mount when asked', () => {
      render(<ImageDropZone selectFileOnMount />);
      expect(pickers).toHaveLength(1);
    });

    it('waits for a click otherwise', () => {
      render(<ImageDropZone />);
      expect(pickers).toHaveLength(0);
    });
  });

  describe('dropping a file', () => {
    it('takes a dropped image', async () => {
      const onChange = jest.fn();
      render(<ImageDropZone onChange={onChange} />);
      dropOn(screen.getByRole('button'), [IMAGE]);
      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
      expect(onChange.mock.calls[0][0]).toBe(IMAGE);
    });

    it('ignores a dropped file that is not an image', () => {
      const onChange = jest.fn();
      render(<ImageDropZone onChange={onChange} />);
      dropOn(screen.getByRole('button'), [new File(['text'], 'notes.txt', { type: 'text/plain' })]);
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText('Click or drop an image')).toBeInTheDocument();
    });

    it('marks the zone while something is dragged over it', () => {
      render(<ImageDropZone />);
      const zone = screen.getByRole('button');
      fireEvent.dragOver(zone);
      expect(zone).toHaveClass('volta-image_drop_zone--dragging');
      fireEvent.dragLeave(zone);
      expect(zone).not.toHaveClass('volta-image_drop_zone--dragging');
      fireEvent.dragOver(zone);
      dropOn(zone, []);
      expect(zone).not.toHaveClass('volta-image_drop_zone--dragging');
    });
  });
});
