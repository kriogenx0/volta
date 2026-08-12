import { render } from '@testing-library/react';

import ImageCrop from '../../components/ImageCrop/ImageCrop';

beforeAll(() => {
  global.URL.createObjectURL = global.URL.createObjectURL || (() => 'blob:mock');
});

describe('ImageCrop', () => {
  it('renders without crashing', () => {
    const image = new File(['contents'], 'photo.png', { type: 'image/png' });
    const { container } = render(
      <ImageCrop image={image} width={300} height={200} onCrop={() => {}} onClose={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});
