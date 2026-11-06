import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent, act } from '@testing-library/react';

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

describe('FilePicker with several files', () => {
  let input;
  let createElement;

  // The picker opens the file dialog from an <input type="file"> it creates itself;
  // catch that input, then answer it with files the way the browser would.
  beforeEach(() => {
    const realCreate = document.createElement.bind(document);
    createElement = jest.spyOn(document, 'createElement').mockImplementation((tag, ...rest) => {
      const element = realCreate(tag, ...rest);
      if (tag === 'input') input = element;
      return element;
    });
  });

  afterEach(() => createElement.mockRestore());

  const png = (name) => new File(['x'], name, { type: 'image/png' });

  const pick = (...files) => {
    fireEvent.click(screen.getByRole('button', { name: /Select File|Change File/ }));
    Object.defineProperty(input, 'files', { value: files, configurable: true });
    act(() => { input.dispatchEvent(new Event('change')); });
  };

  it('lists each file as it is picked, not only the first', () => {
    render(<FilePicker multiple />);
    pick(png('one.png'));
    expect(screen.getByText('one.png')).toBeInTheDocument();

    pick(png('two.png'));
    expect(screen.getByText('one.png')).toBeInTheDocument();
    expect(screen.getByText('two.png')).toBeInTheDocument();

    pick(png('three.png'), png('four.png'));
    expect(screen.getAllByText(/\.png$/).map((el) => el.textContent)).toEqual(['one.png', 'two.png', 'three.png', 'four.png']);
  });

  it('reports every file picked so far to onChange, each time with a new array', () => {
    const onChange = jest.fn();
    render(<FilePicker multiple onChange={onChange} />);
    pick(png('one.png'));
    pick(png('two.png'));

    expect(onChange).toHaveBeenCalledTimes(2);
    const [first, second] = onChange.mock.calls.map(([files]) => files);
    expect(first.map((f) => f.name)).toEqual(['one.png']);
    expect(second.map((f) => f.name)).toEqual(['one.png', 'two.png']);
    expect(second).not.toBe(first);
  });

  it('removes one file and keeps the rest', () => {
    render(<FilePicker multiple />);
    pick(png('one.png'));
    pick(png('two.png'));
    fireEvent.click(document.querySelectorAll('.file_picker-file button')[0]);
    expect(screen.queryByText('one.png')).toBeNull();
    expect(screen.getByText('two.png')).toBeInTheDocument();
  });

  it('replaces the file when it is not multiple', () => {
    render(<FilePicker />);
    pick(png('one.png'));
    pick(png('two.png'));
    expect(screen.queryByText('one.png')).toBeNull();
    expect(screen.getByText('two.png')).toBeInTheDocument();
  });
});
