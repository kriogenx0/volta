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

describe('SegmentedControl highlight and navigation', () => {
  const options = [{ label: 'One', value: 1 }, { label: 'Two', value: 2 }];

  it('draws a sliding highlight behind the selected option, and none when nothing is selected', () => {
    const { container, rerender } = render(<SegmentedControl options={options} value={1} onChange={() => {}} />);
    expect(container.querySelector('.volta-segmented_control-thumb')).toBeInTheDocument();
    expect(container.querySelector('.volta-segmented_control-thumb')).toHaveAttribute('aria-hidden', 'true');

    rerender(<SegmentedControl options={options} value={3} onChange={() => {}} />);
    expect(container.querySelector('.volta-segmented_control-thumb')).toBeNull();
  });

  it('only animates the highlight after it has first been placed', () => {
    const { container, rerender } = render(<SegmentedControl options={options} value={1} onChange={() => {}} />);
    rerender(<SegmentedControl options={options} value={2} onChange={() => {}} />);
    expect(container.querySelector('.volta-segmented_control-thumb')).toHaveClass('volta-segmented_control-thumb--animate');
  });

  it('is a nav with aria-current on the selected option in navigation mode', () => {
    render(<SegmentedControl navigation ariaLabel="Pages" className="mine" options={options} value={2} onChange={() => {}} />);
    const nav = screen.getByRole('navigation', { name: 'Pages' });
    expect(nav).toHaveClass('volta-segmented_control', 'mine');
    expect(screen.getByText('Two')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('One')).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Two')).not.toHaveAttribute('aria-pressed');
  });
});
