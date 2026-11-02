import { render, screen, fireEvent } from '@testing-library/react';

import SegmentedControl from '../../components/SegmentedControl/SegmentedControl';

const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
];

describe('SegmentedControl', () => {
  it('renders without crashing', () => {
    const { container } = render(<SegmentedControl />);
    expect(container).toBeInTheDocument();
  });

  it('marks the selected option as pressed and active', () => {
    render(<SegmentedControl options={options} value="dark" onChange={() => {}} ariaLabel="Theme" />);
    expect(screen.getByRole('group', { name: 'Theme' })).toHaveClass('volta-segmented_control--md');
    expect(screen.getByText('Dark')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Dark')).toHaveClass('volta-segmented_control-option--active');
    expect(screen.getByText('Light')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Light')).not.toHaveClass('volta-segmented_control-option--active');
  });

  it('calls onChange with the clicked option value', () => {
    const onChange = jest.fn();
    render(<SegmentedControl options={options} value="light" onChange={onChange} />);
    fireEvent.click(screen.getByText('Dark'));
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('applies the size modifier and disables every option', () => {
    render(<SegmentedControl options={options} value="light" onChange={() => {}} size="sm" disabled />);
    expect(screen.getByRole('group')).toHaveClass('volta-segmented_control--sm');
    expect(screen.getByText('Light')).toBeDisabled();
  });
});
