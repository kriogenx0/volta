import { render, screen } from '@testing-library/react';

import ImageCrop from '../../components/ImageCrop/ImageCrop';

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
});
