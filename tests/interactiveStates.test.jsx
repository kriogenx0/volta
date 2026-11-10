import fs from 'fs';
import path from 'path';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import components from '../styleguide/views/ComponentExamples/components';

// An audit of keyboard operation and focus, over every styleguide example.
//
// 1. Anything that reacts to a click must be reachable and usable without a mouse:
//    a native control (button, link, input, select, textarea, label, summary), or
//    an element with a role and a tab stop (or, for the roles that move focus with
//    the arrow keys, such as tabs, a place in that roving set). React keeps each element's props on the
//    DOM node, so this finds real handlers in the rendered output.
//    Some elements are deliberately click-only; they are listed in EXCEPTIONS with
//    the reason. A new click-only element fails the test (make it a control, or
//    list it with a reason), and so does an exception that is no longer found.
// 2. No tab stop is positive (tabindex > 0 pulls an element out of the natural order).
// 3. A stylesheet that removes the focus outline must put something visible back.
//
// Not covered, because jsdom has no CSS: that hover, focus and disabled states
// look right. Those need a browser (docs/features/interactive_states.md).

const NATIVE = new Set(['button', 'input', 'select', 'textarea', 'summary', 'label', 'option']);

const reactProps = (element) => {
  const key = Object.keys(element).find((name) => name.startsWith('__reactProps$'));
  return key ? element[key] : null;
};

// Roles whose items take turns being the tab stop: one has tabindex 0, the rest -1,
// and the arrow keys move between them (a tab list, a menu, a listbox, a radio group).
const ROVING_ROLES = new Set(['tab', 'option', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'radio', 'treeitem', 'gridcell']);

// A role, and a way in: a tab stop, or (for those roles) a place in a roving set
const reachable = (element) => {
  const role = element.getAttribute('role');
  if (!role) return false;
  if (element.tabIndex >= 0) return true;
  return element.hasAttribute('tabindex') && ROVING_ROLES.has(role);
};

const isNative = (element) => {
  const tag = element.tagName.toLowerCase();
  if (tag === 'a') return element.hasAttribute('href');
  return NATIVE.has(tag);
};

// A short, stable name for an element: tag, role and first class
const signature = (element) => {
  const tag = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  const first = (element.getAttribute('class') || '').split(/\s+/).filter(Boolean)[0];
  return `${tag}${role ? `[role=${role}]` : ''}${first ? `.${first}` : ''}`;
};

// Elements with a click handler that a keyboard can't use
const clickOnly = (container) => [...container.querySelectorAll('*')]
  .filter((element) => {
    const props = reactProps(element);
    if (!props || typeof props.onClick !== 'function') return false;
    if (isNative(element)) return false;
    return !reachable(element);
  });

const EXCEPTIONS = {
  // A panel that closes when a control inside it is clicked. The controls are
  // buttons, links or items of their own, and Escape closes it.
  'ActionMenu: div.dropdown-contents': 'a container: it hears clicks from the keyboard-operable items inside it',
  'Dropdown: div.dropdown-contents': 'a container: it hears clicks from the keyboard-operable controls inside it',
  'DropdownList: div.dropdown-contents': 'a container: it hears clicks from the keyboard-operable options inside it',
  'DatePicker: div.dropdown-contents': 'a container: it hears clicks from the calendar inside it',
  'AutoComplete: div.twd_dropdown': 'a container: it keeps focus in the text box while an option is clicked; the options are listbox items',
  'AutoComplete: div.autocomplete_chosen': 'a click on the empty space focuses the text box, which is the keyboard way in',

  // A dimmed backdrop or scrim, closed by a click outside. Escape does the same.
  'Dialog: div[role=dialog].volta-pop_over': 'the backdrop: clicking outside closes it, and Escape does too',
  'PopOver: div[role=dialog].volta-pop_over': 'the backdrop: clicking outside closes it, and Escape does too',
  'SearchSelector: div[role=dialog].volta-pop_over': 'the backdrop: clicking outside closes it, and Escape does too',
  'PopOver: div.inner-overlay': 'the click-catcher behind an in-place popover; Escape closes it',
  'ModalDialog: div.volta-modal': 'the backdrop: clicking outside cancels, and Escape does too',
  'Drawer: div.drawer-overlay': 'the scrim: clicking it closes the drawer, and Escape does too',

  // Not ours to change, or not meant to be focused
  'MultiSelect: div[role=button].multi-select__multi-value__remove': "react-select's remove control; its values are removed from the keyboard with Backspace",
  'DropdownList: div[role=option].v-dropdown_list_item': 'a disabled item ("No options available"), which is not meant to take focus',
  'VideoPlayer: video': 'a click plays and pauses; the native controls, or the keyboard handling it adds without them, are the keyboard way',

  // Wrappers that need the right child
  'ImageUploader: div.volta-image_uploader': 'a wrapper around the control you pass as its child (a button, say): Enter on that child clicks the wrapper',

  // An example, not a component
  'Layer: div': "the example's own parent, which shows that a click in a layer bubbles up to it"
};

const scan = () => {
  const found = {};
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const positive = [];

  components.forEach((component) => {
    (component.examples || []).forEach((example) => {
      const { container, unmount } = render(<MemoryRouter>{example.output}</MemoryRouter>);
      clickOnly(container).forEach((element) => {
        found[`${component.name}: ${signature(element)}`] = true;
      });
      container.querySelectorAll('[tabindex]').forEach((element) => {
        if (Number(element.getAttribute('tabindex')) > 0) positive.push(`${component.name} / ${example.name}: ${signature(element)}`);
      });
      unmount();
    });
  });

  error.mockRestore();
  warn.mockRestore();
  return { found: Object.keys(found).sort(), positive };
};

describe('keyboard operation across the examples', () => {
  const { found, positive } = scan();

  it('has no click-only element that is not a reviewed exception', () => {
    expect(found.filter((name) => !(name in EXCEPTIONS))).toEqual([]);
  });

  it('has no exception that is no longer found, so the list stays honest', () => {
    expect(Object.keys(EXCEPTIONS).filter((name) => !found.includes(name))).toEqual([]);
  });

  it('gives every exception a reason', () => {
    Object.entries(EXCEPTIONS).forEach(([, reason]) => expect(reason.length).toBeGreaterThan(20));
  });

  it('puts no element ahead of the natural tab order (no positive tabindex)', () => {
    expect(positive).toEqual([]);
  });
});

describe('the audit itself', () => {
  const clickable = (ui) => {
    const { container } = render(ui);
    return clickOnly(container).map(signature);
  };

  it('flags a clickable div, span and list item', () => {
    expect(clickable(<div><div className="a" onClick={() => {}} /><span onClick={() => {}} /><ul><li onClick={() => {}} /></ul></div>)).toEqual(['div.a', 'span', 'li']);
  });

  it('flags a role with no tab stop, and a link with no href', () => {
    expect(clickable(<div><div role="button" onClick={() => {}} /><a onClick={() => {}}>x</a></div>)).toEqual(['div[role=button]', 'a']);
  });

  it('passes native controls, and a role with a tab stop', () => {
    expect(clickable(
      <div>
        <button type="button" onClick={() => {}}>b</button>
        <a href="/x" onClick={() => {}}>l</a>
        <div role="button" tabIndex={0} onClick={() => {}} />
        <input onClick={() => {}} />
      </div>
    )).toEqual([]);
  });

  it('passes the unselected tabs of a tab list (tabindex -1), but not a button nobody can reach', () => {
    expect(clickable(<div role="tablist"><div role="tab" tabIndex={0} onClick={() => {}} /><div role="tab" tabIndex={-1} onClick={() => {}} /></div>)).toEqual([]);
    expect(clickable(<div role="button" tabIndex={-1} onClick={() => {}} />)).toEqual(['div[role=button]']);
  });

  it('ignores elements with no click handler', () => {
    expect(clickable(<div><div /><span>text</span></div>)).toEqual([]);
  });
});

// --- focus outlines -------------------------------------------------------

const ROOT = path.join(__dirname, '..');

const stylesheets = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : stylesheets(full);
  return /\.scss$/.test(entry.name) ? [full] : [];
});

// The text of the { } block around an index
const enclosingBlock = (text, index) => {
  let depth = 0;
  let start = index;
  while (start > 0) {
    start -= 1;
    if (text[start] === '}') depth += 1;
    if (text[start] === '{') {
      if (depth === 0) break;
      depth -= 1;
    }
  }
  depth = 0;
  let end = index;
  while (end < text.length) {
    if (text[end] === '{') depth += 1;
    if (text[end] === '}') {
      if (depth === 0) break;
      depth -= 1;
    }
    end += 1;
  }
  return text.slice(start, end);
};

const REMOVES_OUTLINE = /outline:\s*(?:none|0)\b|outline-style:\s*none/g;
// Something that stands in for the outline in the same rule
const REPLACEMENT = /border(?:-color)?:|box-shadow:|outline:\s*\d/;
// Or the control sits in a container that shows focus
const CONTAINER_FOCUS = /:focus-visible|:focus-within/;

const unreplaced = (text) => [...text.matchAll(REMOVES_OUTLINE)]
  .filter((match) => !REPLACEMENT.test(enclosingBlock(text, match.index).replace(REMOVES_OUTLINE, '')) && !CONTAINER_FOCUS.test(text))
  .map((match) => text.slice(0, match.index).split('\n').length);

describe('focus outlines', () => {
  it('are never removed without something visible in their place', () => {
    const offenders = ['components', 'styles', 'styleguide']
      .flatMap((dir) => stylesheets(path.join(ROOT, dir)))
      .flatMap((file) => unreplaced(fs.readFileSync(file, 'utf8')).map((line) => `${path.relative(ROOT, file)}:${line}`));
    expect(offenders).toEqual([]);
  });

  it('would catch a removed outline with no replacement', () => {
    expect(unreplaced('.a:focus { outline: 0; }')).toEqual([1]);
    expect(unreplaced('.a:focus {\n  color: red;\n  outline: none;\n}')).toEqual([3]);
  });

  it('accepts a border, a shadow or a container focus ring as the replacement', () => {
    expect(unreplaced('.a:focus { border-color: blue; outline: 0; }')).toEqual([]);
    expect(unreplaced('.a:focus-visible { outline: 0; box-shadow: 0 0 0 3px blue; }')).toEqual([]);
    expect(unreplaced('.box:focus-within { border-color: blue; }\n.box input { outline: 0; }')).toEqual([]);
  });
});
