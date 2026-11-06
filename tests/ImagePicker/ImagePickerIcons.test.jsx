import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ImagePicker from '../../components/ImagePicker/ImagePicker';

// The icons are drawn inline (Icon), so they show without Font Awesome.
describe('ImagePicker icons', () => {
  it('shows an upload cloud until there is an image', () => {
    const { container } = render(<ImagePicker />);
    const cloud = container.querySelector('i.icon-cloud-upload');
    expect(cloud).toBeInTheDocument();
    expect(cloud.querySelector('svg path')).toBeInTheDocument();
    expect(cloud).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows a trash can on the remove button, and no cloud, once there is an image', () => {
    const { container } = render(<ImagePicker defaultImageUrl="/photo.png" />);
    expect(screen.getByRole('button', { name: 'Remove image' }).querySelector('i.icon-trash svg')).toBeInTheDocument();
    expect(container.querySelector('i.icon-cloud-upload')).toBeNull();
  });

  it('shows a spinner while the chosen file is read, then the image', async () => {
    const { container } = render(<ImagePicker />);
    fireEvent.change(screen.getByLabelText('Choose an image'), {
      target: { files: [new File(['pixels'], 'photo.png', { type: 'image/png' })] }
    });

    expect(container.querySelector('i.icon-spinner svg')).toBeInTheDocument();
    expect(container.querySelector('i.icon-cloud-upload')).toBeNull();

    await waitFor(() => expect(container.querySelector('i.icon-spinner')).toBeNull());
  });

  it('draws no Font Awesome icons', () => {
    const { container } = render(<ImagePicker defaultImageUrl="/photo.png" />);
    expect(container.querySelector('.fa')).toBeNull();
  });
});
