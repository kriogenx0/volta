import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { computeAccessibleName } from 'dom-accessibility-api';

import components from '../styleguide/views/ComponentExamples/components';

// A button, link or menu item that shows only an icon has no text for a screen
// reader to read, so it needs an aria-label. This renders every styleguide
// example and fails for any button, link or similar control with no accessible
// name. (Form fields are a separate matter: they take their name from a label.)

const CONTROLS = [
  'button',
  'a[href]',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="option"]'
].join(', ');

// Controls drawn by a third-party widget, which this library can't label.
const THIRD_PARTY = [
  '.ql-toolbar', // Quill's toolbar
  '.ql-tooltip',
  '[class*="multi-select__"]' // react-select's remove-value control, in MultiSelect
].join(', ');

const unnamedIn = (container) => [...container.querySelectorAll(CONTROLS)]
  .filter((element) => !element.closest(THIRD_PARTY) && !element.closest('[aria-hidden="true"]'))
  .filter((element) => computeAccessibleName(element).trim() === '')
  .map((element) => `<${element.tagName.toLowerCase()}${element.getAttribute('role') ? ` role="${element.getAttribute('role')}"` : ''} class="${element.className}">`);

describe.each(components)('$name examples', (component) => {
  const examples = component.examples || [];

  it.each(examples.map((example) => [example.name, example]))('%s: every button and link has an accessible name', (_name, example) => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container, unmount } = render(<MemoryRouter>{example.output}</MemoryRouter>);
    const unnamed = unnamedIn(container);
    unmount();
    error.mockRestore();
    warn.mockRestore();
    expect(unnamed).toEqual([]);
  });
});

describe('the check itself', () => {
  it('finds an icon-only button with no label, and passes one with a label', () => {
    const { container } = render(
      <div>
        <button type="button"><svg aria-hidden="true" /></button>
        <button type="button" aria-label="Close"><svg aria-hidden="true" /></button>
        <a href="/x"><svg aria-hidden="true" /></a>
        <a href="/y">Home</a>
      </div>
    );
    expect(unnamedIn(container)).toHaveLength(2);
  });

  it('skips controls drawn by the third-party widgets it names', () => {
    const { container } = render(<div className="ql-toolbar"><button type="button" /></div>);
    expect(unnamedIn(container)).toEqual([]);
  });
});
