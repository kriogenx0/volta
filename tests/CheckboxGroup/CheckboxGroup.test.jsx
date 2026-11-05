import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import CheckboxGroup from '../../components/CheckboxGroup/CheckboxGroup';

const options = [
  { label: 'Apples', value: 'apples' },
  { label: 'Bananas', value: 'bananas' },
  { label: 'Cherries', value: 'cherries' }
];

describe('CheckboxGroup', () => {
  it('renders without crashing', () => {
    const { container } = render(<CheckboxGroup name="fruits" />);
    expect(container).toBeInTheDocument();
  });

  it('renders one checkbox per option inside the spaced group wrapper', () => {
    const { container } = render(<CheckboxGroup name="fruits" options={options} value={[]} onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('volta-checkboxgroup');
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('adds a custom className to the wrapper', () => {
    const { container } = render(<CheckboxGroup name="fruits" className="extra" options={options} value={[]} />);
    expect(container.firstChild).toHaveClass('volta-checkboxgroup', 'extra');
  });

  it('checks the options listed in value', () => {
    render(<CheckboxGroup name="fruits" options={options} value={['bananas']} onChange={() => {}} />);
    expect(screen.getByLabelText('Bananas')).toBeChecked();
    expect(screen.getByLabelText('Apples')).not.toBeChecked();
  });

  it('gives every option the shared name and its own value', () => {
    render(<CheckboxGroup name="fruits" options={options} value={[]} />);
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.map((box) => box.getAttribute('name'))).toEqual(['fruits', 'fruits', 'fruits']);
    expect(boxes.map((box) => box.getAttribute('value'))).toEqual(['apples', 'bananas', 'cherries']);
  });

  it('calls onChange when an option is toggled', () => {
    const onChange = jest.fn();
    render(<CheckboxGroup name="fruits" options={options} value={[]} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Cherries'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('cherries');
  });

  it('does not throw when toggled without an onChange handler', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<CheckboxGroup name="fruits" options={options} value={[]} />);
    expect(() => fireEvent.click(screen.getByLabelText('Apples'))).not.toThrow();
    consoleError.mockRestore();
  });

  it('disables every option when disabled', () => {
    render(<CheckboxGroup disabled name="fruits" options={options} value={[]} />);
    screen.getAllByRole('checkbox').forEach((box) => expect(box).toBeDisabled());
  });

  it('works as a controlled group that adds and removes values', () => {
    const Controlled = () => {
      const [value, setValue] = useState(['apples']);
      return (
        <CheckboxGroup
          name="fruits"
          options={options}
          value={value}
          onChange={(e) => setValue((prev) => (
            prev.includes(e.target.value) ? prev.filter((v) => v !== e.target.value) : [...prev, e.target.value]
          ))}
        />
      );
    };
    render(<Controlled />);
    fireEvent.click(screen.getByLabelText('Bananas'));
    expect(screen.getByLabelText('Apples')).toBeChecked();
    expect(screen.getByLabelText('Bananas')).toBeChecked();
    fireEvent.click(screen.getByLabelText('Apples'));
    expect(screen.getByLabelText('Apples')).not.toBeChecked();
    expect(screen.getByLabelText('Bananas')).toBeChecked();
  });
});
