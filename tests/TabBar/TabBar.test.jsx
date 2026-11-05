import { render, screen, fireEvent } from '@testing-library/react';

import TabBar from '../../components/TabBar/TabBar';

const tabs = ['Overview', 'Activity', 'Settings'];

const isActive = (name) => screen.getByRole('button', { name }).classList.contains('tab-active');

describe('TabBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<TabBar />);
    expect(container).toBeInTheDocument();
  });

  it('renders a button per tab and selects the first by default', () => {
    render(<TabBar tabs={tabs} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(isActive('Overview')).toBe(true);
    expect(isActive('Activity')).toBe(false);
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Activity' })).not.toHaveAttribute('aria-current');
  });

  it('starts on selectedTabIndex', () => {
    render(<TabBar tabs={tabs} selectedTabIndex={2} />);
    expect(isActive('Settings')).toBe(true);
    expect(isActive('Overview')).toBe(false);
  });

  it('moves the selection when a tab is clicked and calls onChange with index and label', () => {
    const onChange = jest.fn();
    render(<TabBar tabs={tabs} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Activity' }));
    expect(isActive('Activity')).toBe(true);
    expect(isActive('Overview')).toBe(false);
    expect(onChange).toHaveBeenCalledWith(1, 'Activity');
  });

  it('follows a changed selectedTabIndex', () => {
    const { rerender } = render(<TabBar tabs={tabs} selectedTabIndex={0} />);
    rerender(<TabBar tabs={tabs} selectedTabIndex={2} />);
    expect(isActive('Settings')).toBe(true);
  });

  it('labels tabs given as elements with a label prop', () => {
    const onChange = jest.fn();
    render(<TabBar tabs={[<span label="First" key="a" />, <span label="Second" key="b" />]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    expect(onChange).toHaveBeenCalledWith(1, 'Second');
  });

  it('renders every tab without React warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<TabBar tabs={tabs} />);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
