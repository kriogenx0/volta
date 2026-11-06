import { render, screen, fireEvent, within } from '@testing-library/react';
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

const PAGES = ['Home', 'Components', 'Colors', 'Type', 'Layout'];

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
});

const loggedErrors = () => consoleError.mock.calls.map((args) => String(args[0]).split('\n')[0]);

describe('the sidebar', () => {
  it('lists every component that has examples, so none is hidden', () => {
    expect(registered.filter((name) => !listed.includes(name))).toEqual([]);
  });

  it('lists only components that exist: an unknown name is skipped without a word', () => {
    expect(listed.filter((name) => !registered.includes(name))).toEqual([]);
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
