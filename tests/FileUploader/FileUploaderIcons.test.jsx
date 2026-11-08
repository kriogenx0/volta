import { render } from '@testing-library/react';

import FileUploader from '../../components/FileUploader/FileUploader';

// The icons are drawn inline (Icon), so they show without Font Awesome.
describe('FileUploader icons', () => {
  it('offers an upload arrow when there is no file yet', () => {
    const { container } = render(<FileUploader />);
    const icon = container.querySelector('.action i.icon-arrow-up-circle');
    expect(icon).toBeInTheDocument();
    expect(icon.querySelector('svg path')).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('offers a cancel cross while an upload is in progress, and no upload arrow', () => {
    const { container } = render(<FileUploader fileName="photo.png" percent={40} />);
    expect(container.querySelector('.action i.icon-times-circle svg')).toBeInTheDocument();
    expect(container.querySelector('i.icon-arrow-up-circle')).toBeNull();
  });

  it('shows neither once a file is chosen and nothing is uploading', () => {
    const { container } = render(<FileUploader fileName="photo.png" />);
    expect(container.querySelector('.action')).toBeNull();
  });

  it('draws no Font Awesome icons', () => {
    const { container } = render(<FileUploader />);
    expect(container.querySelector('.fa')).toBeNull();
  });
});
