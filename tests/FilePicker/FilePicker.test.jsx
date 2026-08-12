import { render } from '@testing-library/react';

import FilePicker from '../../components/FilePicker/FilePicker';

describe('FilePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<FilePicker />);
    expect(container).toBeInTheDocument();
  });
});
