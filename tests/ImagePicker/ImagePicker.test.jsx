import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ImagePicker from '../../components/ImagePicker/ImagePicker';

const pngFile = (name = 'photo.png') => new File(['pixels'], name, { type: 'image/png' });

const choose = (input, file) => fireEvent.change(input, { target: { files: [file] } });

describe('ImagePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ImagePicker />);
    expect(container).toBeInTheDocument();
  });

  it('applies the default height and accepted file types', () => {
    const { container } = render(<ImagePicker />);
    expect(container.querySelector('.image_background')).toHaveStyle({ height: '300px' });
    expect(screen.getByLabelText('Choose an image')).toHaveAttribute('accept', 'image/*');
  });

  it('uses the height, accept and className props', () => {
    const { container } = render(<ImagePicker height={120} accept="image/png" className="custom" />);
    expect(container.querySelector('.image_background')).toHaveStyle({ height: '120px' });
    expect(screen.getByLabelText('Choose an image')).toHaveAttribute('accept', 'image/png');
    expect(container.firstChild).toHaveClass('volta-image_picker', 'custom');
  });

  it('shows no remove button until there is an image', () => {
    render(<ImagePicker />);
    expect(screen.queryByRole('button', { name: 'Remove image' })).toBeNull();
  });

  it('previews defaultImageUrl and offers to remove it', () => {
    const { container } = render(<ImagePicker defaultImageUrl="/photo.png" />);
    expect(container.querySelector('.image_background').style.backgroundImage).toContain('/photo.png');
    expect(screen.getByRole('button', { name: 'Remove image' })).toBeInTheDocument();
  });

  it('calls onChange with the chosen file and previews it', async () => {
    const onChange = jest.fn();
    const file = pngFile();
    const { container } = render(<ImagePicker onChange={onChange} />);

    choose(screen.getByLabelText('Choose an image'), file);

    expect(onChange).toHaveBeenCalledWith(file);
    await waitFor(() => {
      expect(container.querySelector('.image_background').style.backgroundImage).toContain('data:image/png');
    });
    expect(screen.getByRole('button', { name: 'Remove image' })).toBeInTheDocument();
  });

  it('does not throw when a file is chosen without an onChange handler', async () => {
    const { container } = render(<ImagePicker />);
    expect(() => choose(screen.getByLabelText('Choose an image'), pngFile())).not.toThrow();
    await waitFor(() => {
      expect(container.querySelector('.image_background').style.backgroundImage).toContain('data:image/png');
    });
  });

  it('ignores a change event with no file', () => {
    const onChange = jest.fn();
    render(<ImagePicker onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Choose an image'), { target: { files: [] } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes the image and reports null', async () => {
    const onChange = jest.fn();
    const { container } = render(<ImagePicker onChange={onChange} />);
    choose(screen.getByLabelText('Choose an image'), pngFile());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Remove image' })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Remove image' }));

    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByRole('button', { name: 'Remove image' })).toBeNull();
    expect(container.querySelector('.image_background').style.backgroundImage).toBe('');
  });
});
