import { render, screen, fireEvent } from '@testing-library/react';

import Tabs from '../../components/Tabs/Tabs';

const TABS = ['Overview', 'Activity', 'Settings'];

const tabs = () => screen.getAllByRole('tab');

describe('Tabs keyboard and roles', () => {
  it('is a tab list of tabs, with the chosen one marked selected', () => {
    render(<Tabs tabs={TABS} selectedTabKey={1} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(tabs().map((tab) => tab.textContent)).toEqual(TABS);
    expect(tabs().map((tab) => tab.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
  });

  it('works with an object of key -> label as well', () => {
    render(<Tabs tabs={{ a: 'Alpha', b: 'Beta' }} selectedTabKey="b" />);
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'false');
  });

  describe('the tab order', () => {
    it('has one tab stop: the selected tab', () => {
      render(<Tabs tabs={TABS} selectedTabKey={2} />);
      expect(tabs().map((tab) => tab.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
    });

    it('falls back to the first tab when none is selected', () => {
      render(<Tabs tabs={TABS} />);
      expect(tabs().map((tab) => tab.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    });
  });

  describe('choosing', () => {
    it('calls onSelect with the key and label on a click', () => {
      const onSelect = jest.fn();
      render(<Tabs tabs={TABS} selectedTabKey={0} onSelect={onSelect} />);
      fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
      expect(onSelect).toHaveBeenCalledWith(2, 'Settings');
    });

    it.each([['Enter'], [' ']])('calls onSelect for the focused tab on %p', (key) => {
      const onSelect = jest.fn();
      render(<Tabs tabs={TABS} selectedTabKey={0} onSelect={onSelect} />);
      const tab = screen.getByRole('tab', { name: 'Activity' });
      tab.focus();
      const notPrevented = fireEvent.keyDown(tab, { key });
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(1, 'Activity');
      expect(notPrevented).toBe(false);
    });

    it('does not throw without an onSelect', () => {
      render(<Tabs tabs={TABS} />);
      expect(() => fireEvent.keyDown(tabs()[0], { key: 'Enter' })).not.toThrow();
      expect(() => fireEvent.click(tabs()[0])).not.toThrow();
    });
  });

  describe('moving between tabs', () => {
    const press = (key) => fireEvent.keyDown(document.activeElement, { key });

    it('moves focus with the arrow keys, without choosing', () => {
      const onSelect = jest.fn();
      render(<Tabs tabs={TABS} selectedTabKey={0} onSelect={onSelect} />);
      tabs()[0].focus();

      press('ArrowRight');
      expect(tabs()[1]).toHaveFocus();
      press('ArrowRight');
      expect(tabs()[2]).toHaveFocus();
      press('ArrowLeft');
      expect(tabs()[1]).toHaveFocus();
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('wraps around at both ends', () => {
      render(<Tabs tabs={TABS} selectedTabKey={0} />);
      tabs()[2].focus();
      press('ArrowRight');
      expect(tabs()[0]).toHaveFocus();
      press('ArrowLeft');
      expect(tabs()[2]).toHaveFocus();
    });

    it('jumps to the first and last tab with Home and End', () => {
      render(<Tabs tabs={TABS} selectedTabKey={1} />);
      tabs()[1].focus();
      press('End');
      expect(tabs()[2]).toHaveFocus();
      press('Home');
      expect(tabs()[0]).toHaveFocus();
    });

    it('keeps the arrow keys from scrolling the page', () => {
      render(<Tabs tabs={TABS} selectedTabKey={0} />);
      tabs()[0].focus();
      expect(fireEvent.keyDown(tabs()[0], { key: 'ArrowRight' })).toBe(false);
    });

    it('ignores other keys', () => {
      const onSelect = jest.fn();
      render(<Tabs tabs={TABS} selectedTabKey={0} onSelect={onSelect} />);
      tabs()[0].focus();
      expect(fireEvent.keyDown(tabs()[0], { key: 'a' })).toBe(true);
      expect(onSelect).not.toHaveBeenCalled();
      expect(tabs()[0]).toHaveFocus();
    });
  });
});
