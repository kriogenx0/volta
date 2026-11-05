import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import components from '../styleguide/views/ComponentExamples/components';

// Every component in the styleguide shows several examples (states, variants,
// sizes) and every one of them renders cleanly. The styleguide wraps examples in
// an error boundary that swallows failures, so a broken example would otherwise
// only show up as a small "Couldn't render" box. Examples render inside a
// MemoryRouter, as they do in the styleguide (styleguide/index.js).
const MIN_EXAMPLES = 2;

describe.each(components)('$name examples', (component) => {
  const examples = component.examples || [];

  it(`has at least ${MIN_EXAMPLES} examples`, () => {
    expect(examples.length).toBeGreaterThanOrEqual(MIN_EXAMPLES);
  });

  it('gives each example its own name and the code to show', () => {
    const names = examples.map((example) => example.name);
    expect(names.every((name) => typeof name === 'string' && name.trim() !== '')).toBe(true);
    expect(new Set(names).size).toBe(names.length);
    expect(examples.every((example) => typeof example.code === 'string' && example.code.trim() !== '')).toBe(true);
  });

  describe.each(examples.map((example) => [example.name, example]))('%s', (_name, example) => {
    let consoleError;

    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it('renders without errors or React warnings', () => {
      const { unmount } = render(<MemoryRouter>{example.output}</MemoryRouter>);
      unmount();
      expect(consoleError.mock.calls.map((args) => String(args[0]).split('\n')[0])).toEqual([]);
    });
  });
});
