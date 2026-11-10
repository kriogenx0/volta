import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';

import Tabs, { TabBar } from '../../components/Tabs/Tabs';

const tabs = ['Overview', 'Activity', 'Settings'];

const isSelected = (name) => screen.getByRole('tab', { name }).getAttribute('aria-selected') === 'true';

describe('Tabs selection (what TabBar did)', () => {
  it('selects the first tab by default', () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(isSelected('Overview')).toBe(true);
    expect(isSelected('Activity')).toBe(false);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveClass('tab-selected');
  });

  it('starts on selectedTabIndex', () => {
    render(<Tabs tabs={tabs} selectedTabIndex={2} />);
    expect(isSelected('Settings')).toBe(true);
    expect(isSelected('Overview')).toBe(false);
  });

  it('moves the selection when a tab is clicked, and calls onChange with index and label', () => {
    const onChange = jest.fn();
    render(<Tabs tabs={tabs} onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(isSelected('Activity')).toBe(true);
    expect(isSelected('Overview')).toBe(false);
    expect(onChange).toHaveBeenCalledWith(1, 'Activity');
  });

  it('also calls onSelect with the key and the tab', () => {
    const onSelect = jest.fn();
    render(<Tabs tabs={tabs} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(onSelect).toHaveBeenCalledWith(2, 'Settings');
  });

  it('follows a changed selectedTabIndex', () => {
    const { rerender } = render(<Tabs tabs={tabs} selectedTabIndex={0} />);
    rerender(<Tabs tabs={tabs} selectedTabIndex={2} />);
    expect(isSelected('Settings')).toBe(true);
  });

  it('moves with a click even if the parent keeps the same selectedTabIndex', () => {
    render(<Tabs tabs={tabs} selectedTabIndex={0} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(isSelected('Activity')).toBe(true);
  });

  it('leaves the choice to the parent with selectedTabKey', () => {
    const onSelect = jest.fn();
    render(<Tabs tabs={tabs} selectedTabKey={0} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(onSelect).toHaveBeenCalledWith(1, 'Activity');
    expect(isSelected('Overview')).toBe(true);
    expect(isSelected('Activity')).toBe(false);
  });

  it('labels tabs given as elements with a label prop', () => {
    const onChange = jest.fn();
    render(<Tabs tabs={[<span label="First" key="a" />, <span label="Second" key="b" />]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));
    expect(onChange).toHaveBeenCalledWith(1, 'Second');
  });

  it('selects the first key of an object of tabs, and reports object keys', () => {
    const onSelect = jest.fn();
    render(<Tabs tabs={{ a: 'Alpha', b: 'Beta' }} onSelect={onSelect} />);
    expect(isSelected('Alpha')).toBe(true);
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(onSelect).toHaveBeenCalledWith('b', 'Beta');
    expect(isSelected('Beta')).toBe(true);
  });

  it('renders every tab without React warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Tabs tabs={tabs} />);
    render(<Tabs tabs={[<span label="One" key="1" />, <b key="2">Two</b>]} />);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('copes with no tabs', () => {
    expect(() => render(<Tabs />)).not.toThrow();
    expect(() => render(<Tabs tabs={[]} selectedTabIndex={3} />)).not.toThrow();
  });

  it('TabBar is Tabs itself', () => {
    expect(TabBar).toBe(Tabs);
  });
});

describe('Tabs selection bar', () => {
  const bar = (container) => container.querySelector('.tab-indicator');

  it('draws one bar under the selected tab, hidden from assistive technology', () => {
    const { container } = render(<Tabs tabs={tabs} />);
    expect(container.querySelectorAll('.tab-indicator')).toHaveLength(1);
    expect(bar(container)).toHaveAttribute('aria-hidden', 'true');
    expect(bar(container)).toHaveStyle({ transform: 'translateX(0px)' });
  });

  it('is not an element of the list: the tabs are still the only list items', () => {
    const { container } = render(<Tabs tabs={tabs} />);
    expect(container.querySelectorAll('li')).toHaveLength(3);
    expect(container.querySelector('ul > .tab-indicator')).toBeInTheDocument();
  });

  it('only slides after it has been placed, so it does not fly in on first paint', () => {
    const { container, rerender } = render(<Tabs tabs={tabs} selectedTabKey={0} />);
    rerender(<Tabs tabs={tabs} selectedTabKey={2} />);
    expect(bar(container)).toHaveClass('tab-indicator--slide');
  });

  it('is gone when no tab is selected', () => {
    const { container } = render(<Tabs tabs={tabs} selectedTabKey={9} />);
    expect(bar(container)).toBeNull();
  });

  it('slides with the global animation speed, and holds still for reduced motion', () => {
    const scss = fs.readFileSync(path.join(__dirname, '../../components/Tabs/Tabs.scss'), 'utf8');
    expect(scss).toMatch(/\.tab-indicator--slide \{[^}]*transition:\s*transform \$anim-speed-normal[^}]*width \$anim-speed-normal/);
    expect(scss).toMatch(/prefers-reduced-motion: reduce\)\s*\{[^}]*\.tab-indicator--slide \{\s*transition:\s*none/);
    expect(scss).not.toMatch(/\.tab-selected \{[^}]*border-bottom-color/);
  });
});
