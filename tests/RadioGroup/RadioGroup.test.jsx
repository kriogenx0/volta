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

  it('checks the option matching value', () => {
    render(<RadioGroup name="plan" options={options} value="pro" onChange={() => {}} />);
    expect(screen.getByLabelText('Pro')).toBeChecked();
    expect(screen.getByLabelText('Free')).not.toBeChecked();
  });

  it('calls onChange when another option is chosen', () => {
    const onChange = jest.fn();
    render(<RadioGroup name="plan" options={options} value="pro" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Enterprise'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
