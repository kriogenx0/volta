import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent } from '@testing-library/react';

import FilePicker from '../../components/FilePicker/FilePicker';

describe('FilePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<FilePicker />);
    expect(container).toBeInTheDocument();
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('FilePicker with the automatic JSX runtime', () => {
  it('has a no-op onChange by default', () => {
    const onError = jest.fn();
    window.addEventListener('error', onError);
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(jsx(FilePicker, { defaultValue: { name: 'photo.png', typeClass: 'image' } }));
    expect(screen.getByText('photo.png')).toBeInTheDocument();
    expect(screen.getByText('Change File')).toBeInTheDocument();

    // Removing a file calls onChange, which throws if the default is missing.
    fireEvent.click(container.querySelector('.file_picker-file button'));

    expect(screen.queryByText('photo.png')).not.toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();

    window.removeEventListener('error', onError);
    consoleError.mockRestore();
  });
});
