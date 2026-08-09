import { render, screen, fireEvent } from '@testing-library/react';

import Select from './Select';

const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' }
];

describe('Select', () => {
  it('renders an option per item', () => {
    render(<Select name="test" options={options} value="1" onChange={() => {}} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
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
});
