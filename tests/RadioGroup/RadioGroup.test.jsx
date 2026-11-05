import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import RadioGroup from '../../components/RadioGroup/RadioGroup';

const options = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' }
];

describe('RadioGroup', () => {
  it('renders without crashing', () => {
    const { container } = render(<RadioGroup />);
    expect(container).toBeInTheDocument();
  });

  it('renders one radio per option inside the spaced group wrapper', () => {
    const { container } = render(<RadioGroup name="plan" options={options} value="pro" onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('volta-radiogroup');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('adds a custom className to the wrapper', () => {
    const { container } = render(<RadioGroup name="plan" className="extra" options={options} value="pro" />);
    expect(container.firstChild).toHaveClass('volta-radiogroup', 'extra');
  });

  it('gives every radio the shared name and its own value', () => {
    render(<RadioGroup name="plan" options={options} value="pro" />);
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('name'))).toEqual(['plan', 'plan', 'plan']);
    expect(radios.map((radio) => radio.getAttribute('value'))).toEqual(['free', 'pro', 'enterprise']);
  });

  it('checks the option matching value', () => {
    render(<RadioGroup name="plan" options={options} value="pro" onChange={() => {}} />);
    expect(screen.getByLabelText('Pro')).toBeChecked();
    expect(screen.getByLabelText('Free')).not.toBeChecked();
  });

  it('checks nothing when value is empty or missing', () => {
    const { rerender } = render(<RadioGroup name="plan" options={options} value="" />);
    screen.getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked());
    rerender(<RadioGroup name="plan" options={options} />);
    screen.getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked());
  });

  it('calls onChange when another option is chosen', () => {
    const onChange = jest.fn();
    render(<RadioGroup name="plan" options={options} value="pro" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Enterprise'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('enterprise');
  });

  it('does not throw when chosen without an onChange handler', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RadioGroup name="plan" options={options} value="pro" />);
    expect(() => fireEvent.click(screen.getByLabelText('Free'))).not.toThrow();
    consoleError.mockRestore();
  });

  it('moves the selection when the parent updates value', () => {
    const Controlled = () => {
      const [value, setValue] = useState('free');
      return <RadioGroup name="plan" options={options} value={value} onChange={(e) => setValue(e.target.value)} />;
    };
    render(<Controlled />);
    expect(screen.getByLabelText('Free')).toBeChecked();
    fireEvent.click(screen.getByLabelText('Pro'));
    expect(screen.getByLabelText('Pro')).toBeChecked();
    expect(screen.getByLabelText('Free')).not.toBeChecked();
  });

  it('keeps a number-valued option selected after the change event hands back a string', () => {
    const seats = [{ label: '1 seat', value: 1 }, { label: '5 seats', value: 5 }];
    const Controlled = () => {
      const [value, setValue] = useState(1);
      return <RadioGroup name="seats" options={seats} value={value} onChange={(e) => setValue(e.target.value)} />;
    };
    render(<Controlled />);
    expect(screen.getByLabelText('1 seat')).toBeChecked();
    fireEvent.click(screen.getByLabelText('5 seats'));
    expect(screen.getByLabelText('5 seats')).toBeChecked();
  });
});
