import { act, render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Theme } from '../components';
import VoltaDocs from '../styleguide/views/VoltaDocs';
import components from '../styleguide/views/ComponentExamples/components';
import groups from '../styleguide/views/ComponentExamples/componentGroups';

// A smoke test of the styleguide as a whole, in light and dark: the shell renders,
// every page opens, every component in the sidebar opens with all of its examples,
// and nothing logs an error or falls back to the "Couldn't render" box (the
// styleguide's error boundary swallows failures, so it would otherwise go unseen).
//
// It is not a visual regression test: jsdom has no CSS and draws nothing. Comparing
// screenshots needs a real browser and tooling the repository does not have
// (docs/backlog/add-styleguide-smoke-test.md).

const PAGES = ['Home', 'Components', 'Colors', 'Type', 'Layout', 'Naming'];

const listed = groups.flatMap((group) => group.components);
const registered = components.map((component) => component.name);

const showStyleguide = () => render(<MemoryRouter><VoltaDocs /></MemoryRouter>);

const openPage = (name) => fireEvent.click(within(screen.getByRole('navigation', { name: 'Styleguide sections' })).getByRole('button', { name }));

const errorBoxes = (container) => container.querySelectorAll('.example-error').length;

let consoleError;
let consoleWarn;

beforeEach(() => {
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
  consoleWarn.mockRestore();
  Theme.resetTheme();
  Theme.setColorScheme('system');
  window.location.hash = '';
});

const loggedErrors = () => consoleError.mock.calls.map((args) => String(args[0]).split('\n')[0]);

describe('the sidebar', () => {
  it('lists every component that has examples, so none is hidden', () => {
    expect(registered.filter((name) => !listed.includes(name))).toEqual([]);
  });

  it('lists only components that exist: an unknown name is skipped without a word', () => {
    expect(listed.filter((name) => !registered.includes(name))).toEqual([]);
  });

  it('keeps each group in alphabetical order', () => {
    const unsorted = groups
      .filter((group) => !group.ordered)
      .filter((group) => group.components.some((name, i) => i > 0 && name.localeCompare(group.components[i - 1]) < 0))
      .map((group) => group.label);
    expect(unsorted).toEqual([]);
  });

  it('keeps the Inputs in the order written: the text fields first, then the pickers', () => {
    const inputs = groups.find((group) => group.label === 'Inputs');
    expect(inputs.ordered).toBe(true);
    expect(inputs.components).toEqual([
      'TextBox', 'AutoComplete', 'ComboBox', 'NumericField',
      'MultiSelect', 'NativeSelect', 'TimePicker', 'DatePicker', 'TextEditable'
    ]);
  });

  it('does not list an input again under Controls', () => {
    const inputs = groups.find((group) => group.label === 'Inputs').components;
    const controls = groups.find((group) => group.label === 'Controls').components;
    expect(controls.filter((name) => inputs.includes(name))).toEqual([]);
  });

  it('has the Inputs, Controls and Forms sections, in that order', () => {
    const labels = groups.map((group) => group.label);
    expect(labels.slice(0, 3)).toEqual(['Inputs', 'Controls', 'Forms']);
    expect(labels).not.toContain('Form Controls');
  });

  it('has a Forms section', () => {
    expect(groups.map((group) => group.label)).toEqual(expect.arrayContaining(['Inputs', 'Forms']));
    expect(groups.find((group) => group.label === 'Forms').components).toContain('Field');
  });

  it('lists each component once', () => {
    expect(listed.filter((name, index) => listed.indexOf(name) !== index)).toEqual([]);
  });
});

describe.each(['light', 'dark'])('the styleguide in %s', (scheme) => {
  beforeEach(() => Theme.setColorScheme(scheme));

  it('renders the shell with its navigation and theme controls', () => {
    showStyleguide();
    expect(document.documentElement.getAttribute('data-theme')).toBe(scheme);
    expect(screen.getByRole('navigation', { name: 'Styleguide sections' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Theme:/ })).toBeInTheDocument();
    expect(loggedErrors()).toEqual([]);
  });

  it.each(PAGES)('opens the %s page with content and no errors', (page) => {
    const { container } = showStyleguide();
    openPage(page);
    expect(container.querySelector('main')).not.toBeEmptyDOMElement();
    expect(errorBoxes(container)).toBe(0);
    expect(loggedErrors()).toEqual([]);
  });

  it('opens every component in the sidebar, showing all of its examples', () => {
    const { container } = showStyleguide();
    openPage('Components');

    const problems = [];
    const sidebar = container.querySelector('.component_examples-list');
    within(sidebar).getAllByRole('button').forEach((button) => {
      fireEvent.click(button);
      const name = button.textContent;
      const component = components.find((candidate) => candidate.name === name);
      const heading = container.querySelector('.component-doc-header h2');
      if (!heading || heading.textContent !== name) problems.push(`${name}: its page did not open`);
      const shown = container.querySelectorAll('.style_guide-example').length;
      if (shown !== component.examples.length) problems.push(`${name}: shows ${shown} of ${component.examples.length} examples`);
      if (errorBoxes(container)) problems.push(`${name}: an example fell back to the "Couldn't render" box`);
    });

    expect(problems).toEqual([]);
    expect(loggedErrors()).toEqual([]);
  });
});

describe('the current page', () => {
  afterEach(() => { window.location.hash = ''; });

  it('is kept in the URL, so a refresh opens the same page', () => {
    const first = showStyleguide();
    openPage('Components');
    expect(window.location.hash).toBe('#components');
    first.unmount();

    // A refresh: a new copy of the styleguide reading the same URL
    showStyleguide();
    expect(screen.getByRole('button', { name: 'Components', current: 'page' })).toBeInTheDocument();
  });

  it('follows the URL when it changes, as with the back button', () => {
    showStyleguide();
    openPage('Colors');
    act(() => {
      window.location.hash = '#type';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('button', { name: 'Type', current: 'page' })).toBeInTheDocument();
  });

  it('falls back to Home for an unknown page', () => {
    window.location.hash = '#nope';
    showStyleguide();
    expect(screen.getByRole('button', { name: 'Home', current: 'page' })).toBeInTheDocument();
  });
});

describe('the styleguide under each theme', () => {
  it.each(Theme.presets.map((preset) => [preset.name, preset]))('shows the shell, Home and Colors under %s', (_name, preset) => {
    Theme.applyTheme(preset);
    const { container } = showStyleguide();
    ['Home', 'Colors'].forEach((page) => {
      openPage(page);
      expect(container.querySelector('main')).not.toBeEmptyDOMElement();
    });
    expect(errorBoxes(container)).toBe(0);
    expect(loggedErrors()).toEqual([]);
  });
});

describe('the component search', () => {
  const search = () => screen.getByRole('searchbox', { name: 'Search components' });
  const names = (container) => [...container.querySelectorAll('.component_examples-list .clickable')].map((button) => button.textContent);
  const open = () => {
    const view = showStyleguide();
    openPage('Components');
    return view;
  };
  afterEach(() => { window.location.hash = ''; });

  it('sits at the top of the sidebar, before the groups', () => {
    const { container } = open();
    const list = container.querySelector('.component_examples-list');
    expect(list.firstElementChild).toContainElement(search());
  });

  it('lists every component until something is typed', () => {
    const { container } = open();
    expect(names(container).length).toBe(registered.length);
  });

  it('keeps the components whose name contains the text, ignoring case, in group order', () => {
    const { container } = open();
    fireEvent.change(search(), { target: { value: 'TEXT' } });
    expect(names(container)).toEqual(expect.arrayContaining(['TextBox', 'TextEditable']));
    names(container).forEach((name) => expect(name.toLowerCase()).toContain('text'));
    expect(names(container).indexOf('TextBox')).toBeLessThan(names(container).indexOf('TextEditable'));
  });

  it('hides a group that has nothing left', () => {
    const { container } = open();
    fireEvent.change(search(), { target: { value: 'combobox' } });
    const labels = [...container.querySelectorAll('.component_examples-group_label')].map((label) => label.textContent);
    expect(labels).toEqual(['Inputs']);
  });

  it('says so when nothing matches', () => {
    const { container } = open();
    fireEvent.change(search(), { target: { value: 'zzzz' } });
    expect(names(container)).toEqual([]);
    expect(screen.getByRole('status')).toHaveTextContent('No components match');
  });

  it('opens the first match on Enter and clears on Escape', () => {
    const { container } = open();
    fireEvent.change(search(), { target: { value: 'slider' } });
    fireEvent.keyDown(search(), { key: 'Enter' });
    expect(container.querySelector('.component-doc-header h2')).toHaveTextContent('Slider');

    fireEvent.keyDown(search(), { key: 'Escape' });
    expect(search()).toHaveValue('');
    expect(names(container).length).toBe(registered.length);
  });

  it('keeps the open component when the search no longer lists it', () => {
    const { container } = open();
    fireEvent.change(search(), { target: { value: 'slider' } });
    fireEvent.keyDown(search(), { key: 'Enter' });
    fireEvent.change(search(), { target: { value: 'toggle' } });
    expect(container.querySelector('.component-doc-header h2')).toHaveTextContent('Slider');
  });
});

describe('the Naming page', () => {
  it('states the short-name convention and the design principles', () => {
    const { container } = showStyleguide();
    openPage('Naming');
    expect(screen.getByRole('heading', { name: 'Naming conventions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Design principles' })).toBeInTheDocument();
    expect(screen.getByText('Prefer the shorter name')).toBeInTheDocument();
    expect(container.querySelector('.naming-names--prefer')).toHaveTextContent('TextBox');
    expect(container.querySelector('.naming-names--avoid')).toHaveTextContent('TextField');
    expect(container.querySelectorAll('.naming-list li').length).toBeGreaterThanOrEqual(11);
    window.location.hash = '';
  });
});
