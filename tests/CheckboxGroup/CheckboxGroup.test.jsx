import { render, screen, fireEvent } from '@testing-library/react';

import CheckboxGroup from '../../components/CheckboxGroup/CheckboxGroup';

const options = [
  { label: 'Apples', value: 'apples' },
  { label: 'Bananas', value: 'bananas' },
  { label: 'Cherries', value: 'cherries' }
];

describe('CheckboxGroup', () => {
  it('renders without crashing', () => {
    const { container } = render(<CheckboxGroup />);
    expect(container).toBeInTheDocument();
  });

  it('renders one checkbox per option inside the spaced group wrapper', () => {
    const { container } = render(<CheckboxGroup name="fruits" options={options} value={[]} onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('volta-checkboxgroup');
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('checks the options listed in value', () => {
    render(<CheckboxGroup name="fruits" options={options} value={['bananas']} onChange={() => {}} />);
    expect(screen.getByLabelText('Bananas')).toBeChecked();
    expect(screen.getByLabelText('Apples')).not.toBeChecked();
  });

  it('calls onChange when an option is toggled', () => {
    const onChange = jest.fn();
    render(<CheckboxGroup name="fruits" options={options} value={[]} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Cherries'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
