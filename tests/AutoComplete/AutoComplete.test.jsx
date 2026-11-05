import { useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { fireEvent, render, screen } from '@testing-library/react';

import AutoComplete from '../../components/AutoComplete';

const PEOPLE = [
  { title: 'Chloe Nguyen', value: 'chloe' },
  { title: 'Ana Silva', value: 'ana' },
  { title: 'Ben Carter', value: 'ben' },
  { title: 'Dev Patel', value: 'dev' }
];

const box = () => screen.getByRole('combobox');
const open = () => fireEvent.focus(box());
const type = (text) => fireEvent.change(box(), { target: { value: text } });
const press = (keyCode) => fireEvent.keyDown(box(), { keyCode });
const DOWN = 40;
const UP = 38;
const ENTER = 13;
const BACKSPACE = 8;
const ESCAPE = 27;
const optionNames = () => screen.queryAllByRole('option').map((option) => option.textContent);
const choose = (title) => fireEvent.mouseDown(screen.getByRole('option', { name: title }));
const root = (container) => container.querySelector('.volta-auto_complete');

// Keeps the selection in a parent, as an app would
const Controlled = ({ onChange = () => {}, initial = [], ...props }) => {
  const [selected, setSelected] = useState(initial);
  return <AutoComplete selected={selected} onChange={(next) => { setSelected(next); onChange(next); }} {...props} />;
};

describe('AutoComplete', () => {
  it('renders without crashing', () => {
    const { container } = render(<AutoComplete />);
    expect(container).toBeInTheDocument();
  });

  // The app builds JSX with the automatic runtime, which (unlike the classic
  // createElement this suite's Babel config uses) does not apply defaultProps.
  // Making the element with jsx() hands the component exactly what the app does.
  it('renders and can be used with no props at all, as the app builds it', () => {
    render(jsx(AutoComplete, {}));
    expect(() => { open(); type('x'); press(ENTER); }).not.toThrow();
  });

  describe('the list', () => {
    it('is closed until the text box is focused', () => {
      const { container } = render(<AutoComplete options={PEOPLE} />);
      expect(root(container)).not.toHaveClass('is-open');
      open();
      expect(root(container)).toHaveClass('is-open');
      expect(box()).toHaveAttribute('aria-expanded', 'true');
    });

    it('lists the options A to Z', () => {
      render(<AutoComplete options={PEOPLE} />);
      open();
      expect(optionNames()).toEqual(['Ana Silva', 'Ben Carter', 'Chloe Nguyen', 'Dev Patel']);
    });

    it('narrows to the options matching the text', () => {
      render(<AutoComplete options={PEOPLE} />);
      open();
      type('ch');
      expect(optionNames()).toEqual(['Chloe Nguyen']);
    });

    it('says so when nothing matches', () => {
      render(<AutoComplete options={PEOPLE} />);
      open();
      type('zzz');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
      expect(screen.getByText('No matching results.')).toBeInTheDocument();
    });

    it('shows options that arrive after it first rendered', () => {
      const { rerender } = render(<AutoComplete options={[]} />);
      open();
      rerender(<AutoComplete options={PEOPLE} />);
      expect(optionNames()).toHaveLength(4);
    });

    it('leaves out results the isValidResult check rejects', () => {
      render(<AutoComplete options={PEOPLE} isValidResult={(option) => option.value !== 'dev'} />);
      open();
      expect(optionNames()).not.toContain('Dev Patel');
    });

    it('closes when focus leaves', () => {
      const { container } = render(<AutoComplete options={PEOPLE} />);
      open();
      fireEvent.blur(box());
      expect(root(container)).not.toHaveClass('is-open');
    });

    it('closes on a click outside, and stays open for one inside', () => {
      const { container } = render(<><AutoComplete options={PEOPLE} /><p>Elsewhere</p></>);
      open();
      fireEvent.mouseDown(screen.getByRole('listbox'));
      expect(root(container)).toHaveClass('is-open');
      fireEvent.mouseDown(screen.getByText('Elsewhere'));
      expect(root(container)).not.toHaveClass('is-open');
    });

    it('closes on Escape', () => {
      const { container } = render(<AutoComplete options={PEOPLE} />);
      open();
      press(ESCAPE);
      expect(root(container)).not.toHaveClass('is-open');
    });

    it('is not shown when there is nothing to list or search for', () => {
      const { container } = render(<AutoComplete options={[]} />);
      open();
      expect(root(container)).not.toHaveClass('is-open');
    });

    it('uses compact rows when asked', () => {
      render(<AutoComplete options={PEOPLE} compact />);
      expect(screen.getByRole('listbox')).toHaveClass('lst-compact');
    });
  });

  describe('choosing', () => {
    it('adds a pill for a clicked option and reports the selection', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} onChange={onChange} />);
      open();
      choose('Ana Silva');

      expect(onChange).toHaveBeenCalledWith([PEOPLE[1]]);
      expect(screen.getByRole('button', { name: 'Remove Ana Silva' })).toBeInTheDocument();
      expect(optionNames()).not.toContain('Ana Silva');
    });

    it('keeps adding to the selection', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} onChange={onChange} />);
      open();
      choose('Ana Silva');
      open();
      choose('Dev Patel');
      expect(onChange).toHaveBeenLastCalledWith([PEOPLE[1], PEOPLE[3]]);
    });

    it('clears the text and lists every remaining option after a choice', () => {
      render(<Controlled options={PEOPLE} />);
      open();
      type('an');
      choose('Ana Silva');
      expect(box()).toHaveValue('');
      open();
      expect(optionNames()).toEqual(['Ben Carter', 'Chloe Nguyen', 'Dev Patel']);
    });

    it('works as an uncontrolled box too', () => {
      render(<AutoComplete options={PEOPLE} />);
      open();
      choose('Ben Carter');
      expect(screen.getByRole('button', { name: 'Remove Ben Carter' })).toBeInTheDocument();
    });

    it('does not select on a right click', () => {
      const onChange = jest.fn();
      render(<AutoComplete options={PEOPLE} onChange={onChange} />);
      open();
      fireEvent.mouseDown(screen.getByRole('option', { name: 'Ana Silva' }), { button: 2 });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('starts with the selected items as pills and leaves them out of the list', () => {
      render(<AutoComplete options={PEOPLE} selected={[PEOPLE[0]]} />);
      expect(screen.getByRole('button', { name: 'Remove Chloe Nguyen' })).toBeInTheDocument();
      open();
      expect(optionNames()).not.toContain('Chloe Nguyen');
    });

    it('follows a new selected prop', () => {
      const { rerender } = render(<AutoComplete options={PEOPLE} selected={[PEOPLE[0]]} />);
      rerender(<AutoComplete options={PEOPLE} selected={[PEOPLE[2]]} />);
      expect(screen.queryByRole('button', { name: 'Remove Chloe Nguyen' })).toBeNull();
      expect(screen.getByRole('button', { name: 'Remove Ben Carter' })).toBeInTheDocument();
    });

    it('submits the chosen values under its name', () => {
      const { container } = render(<AutoComplete name="people" options={PEOPLE} selected={[PEOPLE[0], PEOPLE[1]]} />);
      const hidden = container.querySelector('input[type="hidden"]');
      expect(hidden).toHaveAttribute('name', 'people');
      expect(hidden).toHaveValue('chloe,ana');
    });

    it('has no name on its hidden field when it has none', () => {
      const { container } = render(<AutoComplete options={PEOPLE} />);
      expect(container.querySelector('input[type="hidden"]')).not.toHaveAttribute('name');
    });
  });

  describe('keyboard', () => {
    it('chooses the highlighted row with Enter and keeps the list open', () => {
      const onChange = jest.fn();
      const { container } = render(<AutoComplete options={PEOPLE} onChange={onChange} />);
      open();
      press(DOWN);
      press(DOWN);
      expect(screen.getByRole('option', { name: 'Ben Carter' })).toHaveAttribute('aria-selected', 'true');
      expect(box().getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Ben Carter' }).id);

      press(ENTER);
      expect(onChange).toHaveBeenCalledWith([PEOPLE[2]]);
      expect(root(container)).toHaveClass('is-open');
    });

    it('moves up again and stops at the first row', () => {
      render(<AutoComplete options={PEOPLE} />);
      open();
      press(DOWN);
      press(DOWN);
      press(UP);
      press(UP);
      press(UP);
      expect(screen.getByRole('option', { name: 'Ana Silva' })).toHaveAttribute('aria-selected', 'true');
    });

    it('stops at the last row', () => {
      render(<AutoComplete options={PEOPLE} />);
      open();
      for (let i = 0; i < 10; i += 1) press(DOWN);
      expect(screen.getByRole('option', { name: 'Dev Patel' })).toHaveAttribute('aria-selected', 'true');
    });

    it('does not move through an empty list', () => {
      render(<AutoComplete options={[]} />);
      open();
      expect(() => { press(DOWN); press(UP); press(ENTER); }).not.toThrow();
    });

    it('does not submit an enclosing form on Enter', () => {
      const onSubmit = jest.fn((e) => e.preventDefault());
      render(<form onSubmit={onSubmit}><AutoComplete options={PEOPLE} /></form>);
      open();
      const notPrevented = fireEvent.keyDown(box(), { keyCode: ENTER });
      expect(notPrevented).toBe(false);
    });

    it('forgets the highlighted row when the text changes', () => {
      const onChange = jest.fn();
      render(<AutoComplete options={PEOPLE} allowAdd onChange={onChange} />);
      open();
      press(DOWN);
      press(DOWN);
      press(DOWN);
      type('zzz');
      press(ENTER);
      expect(onChange).toHaveBeenCalledWith([{ title: 'zzz', value: 'zzz' }]);
    });

    it('removes the last pill after two Backspaces on an empty box', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} initial={[PEOPLE[0], PEOPLE[1]]} onChange={onChange} />);
      open();
      press(BACKSPACE);
      expect(onChange).not.toHaveBeenCalled();
      press(BACKSPACE);
      expect(onChange).toHaveBeenCalledWith([PEOPLE[0]]);
    });

    it('leaves the pills alone when Backspace deletes text', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} initial={[PEOPLE[0]]} onChange={onChange} />);
      open();
      type('a');
      press(BACKSPACE);
      press(BACKSPACE);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('removing', () => {
    it('removes a pill from its remove button', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} initial={[PEOPLE[0], PEOPLE[1]]} onChange={onChange} />);
      fireEvent.click(screen.getByRole('button', { name: 'Remove Ana Silva' }));
      expect(onChange).toHaveBeenCalledWith([PEOPLE[0]]);
      expect(screen.queryByRole('button', { name: 'Remove Ana Silva' })).toBeNull();
    });

    it('offers the removed option in the list again', () => {
      render(<Controlled options={PEOPLE} initial={[PEOPLE[1]]} />);
      fireEvent.click(screen.getByRole('button', { name: 'Remove Ana Silva' }));
      open();
      expect(optionNames()).toContain('Ana Silva');
    });
  });

  describe('single choice', () => {
    it('replaces the earlier choice and closes', () => {
      const onChange = jest.fn();
      const { container } = render(<Controlled options={PEOPLE} limit={1} initial={[PEOPLE[1]]} onChange={onChange} />);
      fireEvent.click(container.querySelector('.autocomplete_chosen_item_pill'));
      choose('Dev Patel');
      expect(onChange).toHaveBeenCalledWith([PEOPLE[3]]);
      expect(screen.queryByRole('button', { name: 'Remove Ana Silva' })).toBeNull();
      expect(root(container)).not.toHaveClass('is-open');
    });

    it('has no remove buttons and disables the text box once chosen', () => {
      const { container } = render(<AutoComplete options={PEOPLE} limit={1} selected={[PEOPLE[1]]} />);
      expect(root(container)).toHaveClass('is-single');
      expect(screen.queryByRole('button')).toBeNull();
      expect(box()).toBeDisabled();
    });

    it('clears the choice from "Clear selection"', () => {
      const onChange = jest.fn();
      const { container } = render(<Controlled options={PEOPLE} limit={1} initial={[PEOPLE[1]]} onChange={onChange} />);
      fireEvent.click(container.querySelector('.autocomplete_chosen_item_pill'));
      fireEvent.click(screen.getByText('Clear selection'));
      expect(onChange).toHaveBeenCalledWith([]);
      expect(box()).toBeEnabled();
    });

    it('opens its list from the chosen pill and closes on a second click', () => {
      const { container } = render(<AutoComplete options={PEOPLE} limit={1} selected={[PEOPLE[1]]} />);
      const pill = container.querySelector('.autocomplete_chosen_item_pill');
      fireEvent.click(pill);
      expect(root(container)).toHaveClass('is-open');
      fireEvent.click(pill);
      expect(root(container)).not.toHaveClass('is-open');
    });
  });

  describe('adding values', () => {
    it('offers to add the typed text and adds it on Enter', () => {
      const onChange = jest.fn();
      const onAdd = jest.fn();
      render(<Controlled options={PEOPLE} allowAdd onChange={onChange} onAdd={onAdd} />);
      open();
      type('Fran');
      expect(screen.getByText(/Add "/)).toBeInTheDocument();
      press(ENTER);

      expect(onChange).toHaveBeenCalledWith([{ title: 'Fran', value: 'Fran' }]);
      expect(onAdd).toHaveBeenCalledWith('Fran');
      expect(box()).toHaveValue('');
    });

    it('adds from the add link', () => {
      const onAdd = jest.fn();
      render(<AutoComplete options={PEOPLE} allowAdd onAdd={onAdd} />);
      open();
      type('Fran');
      fireEvent.click(screen.getByText(/Add "/).closest('a'));
      expect(onAdd).toHaveBeenCalledWith('Fran');
    });

    it('does not offer to add an empty value', () => {
      render(<AutoComplete options={PEOPLE} allowAdd />);
      open();
      expect(screen.queryByText(/Add "/)).toBeNull();
    });

    it('uses formatAddMessage for the add link', () => {
      render(<AutoComplete options={PEOPLE} allowAdd formatAddMessage={(text) => `Create ${text}`} />);
      open();
      type('Fran');
      expect(screen.getByText('Create Fran')).toBeInTheDocument();
    });

    it('does not add the same value twice, or warn about duplicate keys', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      const onAdd = jest.fn();
      render(<Controlled options={PEOPLE} allowAdd onAdd={onAdd} />);
      open();
      type('Fran');
      press(ENTER);
      type('Fran');
      press(ENTER);

      expect(screen.getAllByRole('button', { name: 'Remove Fran' })).toHaveLength(1);
      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });

  describe('detecting email addresses', () => {
    it('adds a valid address on Enter', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} detect="email" onChange={onChange} />);
      open();
      type('ana@example.com');
      press(ENTER);
      expect(onChange).toHaveBeenCalledWith([{ title: 'ana@example.com', value: 'ana@example.com' }]);
    });

    it('adds a valid address on the spacebar, without the space', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} detect="email" onChange={onChange} />);
      open();
      type('ana@example.com ');
      fireEvent.keyUp(box(), { keyCode: 32 });
      expect(onChange).toHaveBeenCalledWith([{ title: 'ana@example.com', value: 'ana@example.com' }]);
    });

    it('ignores text that is not an address', () => {
      const onChange = jest.fn();
      render(<Controlled options={PEOPLE} detect="email" onChange={onChange} />);
      open();
      type('not an email');
      press(ENTER);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('footer', () => {
    it('shows the footer link and reports clicks on it', () => {
      const onFooterClick = jest.fn();
      const { container } = render(<AutoComplete options={PEOPLE} footerTitle="Invite someone" onFooterClick={onFooterClick} />);
      open();
      fireEvent.click(screen.getByText('Invite someone'));
      expect(onFooterClick).toHaveBeenCalledTimes(1);
      expect(root(container)).not.toHaveClass('is-open');
    });

    it('has no footer without a footerTitle', () => {
      const { container } = render(<AutoComplete options={PEOPLE} />);
      expect(container.querySelector('.twd_footer')).toBeNull();
    });
  });

  describe('naming', () => {
    it('uses the placeholder as the name when there is no aria-label', () => {
      render(<AutoComplete placeholder="Search people" />);
      expect(screen.getByRole('combobox', { name: 'Search people' })).toBeInTheDocument();
    });

    it('prefers an aria-label', () => {
      render(<AutoComplete placeholder="Search..." aria-label="Assign to" />);
      expect(screen.getByRole('combobox', { name: 'Assign to' })).toBeInTheDocument();
    });

    it('ties the text box to its list', () => {
      render(<AutoComplete options={PEOPLE} />);
      expect(box()).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    });

    it('calls onFocus when the text box is focused', () => {
      const onFocus = jest.fn();
      render(<AutoComplete options={PEOPLE} onFocus={onFocus} />);
      open();
      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });
});
