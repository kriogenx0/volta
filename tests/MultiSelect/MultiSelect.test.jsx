import { jsx } from 'react/jsx-runtime';
import { fireEvent, render, screen } from '@testing-library/react';

import MultiSelect from '../../components/MultiSelect/MultiSelect';

const OPTIONS = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'eng' },
  { label: 'Support', value: 'support' }
];

const input = () => screen.getByRole('combobox', { name: 'Teams' });

const openMenu = () => {
  fireEvent.focus(input());
  fireEvent.keyDown(input(), { key: 'ArrowDown', keyCode: 40 });
};

const choose = (label) => {
  openMenu();
  fireEvent.click(screen.getByText(label));
};

describe('MultiSelect', () => {
  it('renders without crashing', () => {
    const { container } = render(<MultiSelect />);
    expect(container).toBeInTheDocument();
  });

  // The app builds JSX with the automatic runtime, which (unlike the classic
  // createElement this suite's Babel config uses) does not apply defaultProps.
  it('works with only options, as the app builds it', () => {
    render(jsx(MultiSelect, { 'aria-label': 'Teams', options: OPTIONS }));
    expect(() => choose('Design')).not.toThrow();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('names its input from aria-label', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} />);
    expect(input()).toBeInTheDocument();
  });

  it('shows the placeholder while nothing is selected', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} placeholder="Choose teams" />);
    expect(screen.getByText('Choose teams')).toBeInTheDocument();
  });

  it('draws the remove X and the dropdown arrow as SVG icons, not font glyphs', () => {
    const { container } = render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[OPTIONS[0]]} />);
    const remove = container.querySelector('.volta-multiselect-icon:not(.volta-multiselect-icon--indicator)');
    expect(remove.querySelector('svg path')).toBeInTheDocument();
    expect(container.querySelector('.volta-multiselect-icon--indicator svg path')).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/[\uF000-\uF0FF]/);
  });

  it('starts with the defaultValue selected', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[OPTIONS[0]]} />);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('starts with the value prop selected', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} value={[OPTIONS[1]]} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('follows a changed value prop', () => {
    const { rerender } = render(<MultiSelect aria-label="Teams" options={OPTIONS} value={[OPTIONS[0]]} />);
    rerender(<MultiSelect aria-label="Teams" options={OPTIONS} value={[OPTIONS[2]]} />);
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.queryByText('Design')).toBeNull();
  });

  it('adds a chosen option and reports every selected one', () => {
    const onChange = jest.fn();
    render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[OPTIONS[0]]} onChange={onChange} />);
    choose('Support');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual([OPTIONS[0], OPTIONS[2]]);
    expect(onChange.mock.calls[0][1].action).toBe('select-option');
  });

  it('works without an onChange', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} />);
    expect(() => choose('Design')).not.toThrow();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('removes a selected option from its remove button', () => {
    const onChange = jest.fn();
    render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[OPTIONS[0], OPTIONS[2]]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Support' }));
    expect(onChange.mock.calls[0][0]).toEqual([OPTIONS[0]]);
  });

  it('keeps fixed options when the user tries to remove them', () => {
    const onChange = jest.fn();
    const fixed = { ...OPTIONS[1], fixed: true };
    render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[fixed]} onChange={onChange} />);

    fireEvent.focus(input());
    fireEvent.keyDown(input(), { key: 'Backspace', keyCode: 8 });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('clears down to the fixed options', () => {
    const onChange = jest.fn();
    const fixed = { ...OPTIONS[1], fixed: true };
    const { container } = render(
      <MultiSelect aria-label="Teams" clearable options={OPTIONS} defaultValue={[fixed, OPTIONS[2]]} onChange={onChange} />
    );

    fireEvent.mouseDown(container.querySelector('.multi-select__clear-indicator'));

    expect(onChange.mock.calls[0][0]).toEqual([fixed]);
    expect(screen.queryByText('Support')).toBeNull();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('only offers a clear control when clearable', () => {
    const { container } = render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[OPTIONS[0]]} />);
    expect(container.querySelector('.multi-select__clear-indicator')).toBeNull();
  });

  it('does not offer options that are already selected', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} defaultValue={[OPTIONS[0]]} />);
    openMenu();
    expect(screen.getAllByText('Design')).toHaveLength(1);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('shows the no-options message when nothing matches', () => {
    render(<MultiSelect aria-label="Teams" options={OPTIONS} noOptionsMessage="Nothing here" />);
    openMenu();
    fireEvent.change(input(), { target: { value: 'zzz' } });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('is disabled when asked', () => {
    render(<MultiSelect aria-label="Teams" disabled options={OPTIONS} />);
    expect(screen.getByLabelText('Teams')).toBeDisabled();
  });

  describe('single choice', () => {
    it('reports the chosen option as a one-item array instead of throwing', () => {
      const onChange = jest.fn();
      render(<MultiSelect aria-label="Teams" multiselect={false} options={OPTIONS} onChange={onChange} />);
      choose('Engineering');
      expect(onChange.mock.calls[0][0]).toEqual([OPTIONS[1]]);
      expect(screen.getByText('Engineering')).toBeInTheDocument();
    });

    it('replaces the earlier choice', () => {
      const onChange = jest.fn();
      render(<MultiSelect aria-label="Teams" multiselect={false} options={OPTIONS} onChange={onChange} />);
      choose('Engineering');
      choose('Support');
      expect(onChange).toHaveBeenLastCalledWith([OPTIONS[2]], expect.anything());
      expect(screen.queryByText('Engineering')).toBeNull();
    });

    it('reports an empty array when cleared', () => {
      const onChange = jest.fn();
      const { container } = render(
        <MultiSelect aria-label="Teams" clearable multiselect={false} options={OPTIONS} defaultValue={[OPTIONS[0]]} onChange={onChange} />
      );
      fireEvent.mouseDown(container.querySelector('.multi-select__clear-indicator'));
      expect(onChange.mock.calls[0][0]).toEqual([]);
    });
  });

  it('sets its text to 14px like the other fields, including the chips', () => {
    const { customStyles } = require('../../components/MultiSelect/selectMenuTheme');
    expect(customStyles.container({}).fontSize).toBe(14);
    expect(customStyles.multiValueLabel({}).fontSize).toBe(14);
  });

  it('takes its corners from the radius tokens, so square, rounded and pill apply', () => {
    const { customStyles } = require('../../components/MultiSelect/selectMenuTheme');
    expect(customStyles.control({}, {}).borderRadius).toBe('var(--v-radius-md)');
    expect(customStyles.menu({}).borderRadius).toBe('var(--v-radius-md)');
    expect(customStyles.multiValue({}).borderRadius).toBe('var(--v-radius-md)');
  });

  describe('keeping the menu open', () => {
    const menuShows = (label) => screen.queryByText(label);

    it('stays open after a choice, so several can be picked in a row', () => {
      render(<MultiSelect aria-label="Teams" options={OPTIONS} />);
      choose('Design');
      expect(menuShows('Engineering')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Engineering'));
      expect(menuShows('Support')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Support'));
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('closes after a choice with closeMenuOnSelect', () => {
      render(<MultiSelect aria-label="Teams" options={OPTIONS} closeMenuOnSelect />);
      choose('Design');
      expect(menuShows('Engineering')).toBeNull();
    });

    it('closes after a choice for a single choice (multiselect={false})', () => {
      render(<MultiSelect aria-label="Teams" options={OPTIONS} multiselect={false} />);
      choose('Design');
      expect(menuShows('Engineering')).toBeNull();
    });

    it('can be told to stay open for a single choice too', () => {
      render(<MultiSelect aria-label="Teams" options={OPTIONS} multiselect={false} closeMenuOnSelect={false} />);
      choose('Design');
      expect(menuShows('Engineering')).toBeInTheDocument();
    });
  });
});
