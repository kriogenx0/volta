import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Select from '../../components/Select/Select';

const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' }
];

describe('Select', () => {
  it('renders an option per item', () => {
    render(<Select name="test" options={options} value="1" onChange={() => {}} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('renders without options', () => {
    render(<Select name="test" value="" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('reflects the selected value', () => {
    render(<Select name="test" options={options} value="2" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('calls onChange when a new option is selected', () => {
    const onChange = jest.fn();
    render(<Select name="test" options={options} value="1" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('follows the parent when used as a controlled select', () => {
    const Controlled = () => {
      const [value, setValue] = useState('1');
      return <Select name="test" options={options} value={value} onChange={(e) => setValue(e.target.value)} />;
    };
    render(<Controlled />);
    expect(screen.getByRole('combobox')).toHaveValue('1');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('labels the select and marks optional fields', () => {
    render(<Select label="Plan" optional options={options} value="1" onChange={() => {}} />);
    expect(screen.getByLabelText(/Plan/)).toBe(screen.getByRole('combobox'));
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('does not render a label or the optional marker without a label', () => {
    render(<Select optional options={options} value="1" onChange={() => {}} />);
    expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
  });

  it('uses a given id for the label association', () => {
    render(<Select id="plan-select" label="Plan" options={options} value="1" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'plan-select');
    expect(screen.getByLabelText('Plan')).toBe(screen.getByRole('combobox'));
  });

  it('defaults to the small size and accepts the medium one', () => {
    const { container, rerender } = render(<Select options={options} value="1" onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('volta-select--sm');
    rerender(<Select fieldSize="md" options={options} value="1" onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('volta-select--md');
  });

  it('disables the control', () => {
    render(<Select disabled options={options} value="1" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders its own children instead of options', () => {
    render(
      <Select value="" onChange={() => {}} options={options}>
        <option value="" disabled>Choose</option>
        <option value="x">Custom</option>
      </Select>
    );
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Choose', 'Custom']);
    expect(screen.queryByText('One')).not.toBeInTheDocument();
  });

  it('passes name and className to the select element', () => {
    render(<Select name="city" className="extra" options={options} value="1" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('name', 'city');
    expect(screen.getByRole('combobox')).toHaveClass('extra');
  });
});
