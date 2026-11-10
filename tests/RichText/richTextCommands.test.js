import {
  INLINE_STYLES, LIST_STYLES, PARAGRAPH_STYLES, SHORTCUTS, markdownCommand, matchShortcut, shortcutLabel, stylesAt
} from '../../components/RichText/richTextCommands';

const key = (init) => ({ metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, key: '', code: '', ...init });

describe('matchShortcut', () => {
  it('uses Cmd on a Mac and Ctrl elsewhere', () => {
    expect(matchShortcut(key({ metaKey: true, key: 'b' }), true)).toBe('bold');
    expect(matchShortcut(key({ ctrlKey: true, key: 'b' }), false)).toBe('bold');
    expect(matchShortcut(key({ ctrlKey: true, key: 'b' }), true)).toBeNull();
    expect(matchShortcut(key({ metaKey: true, key: 'b' }), false)).toBeNull();
  });

  it('matches the inline styles', () => {
    const cases = { b: 'bold', i: 'italic', u: 'underline', e: 'code', k: 'link' };
    Object.entries(cases).forEach(([k, command]) => expect(matchShortcut(key({ ctrlKey: true, key: k }), false)).toBe(command));
    expect(matchShortcut(key({ ctrlKey: true, shiftKey: true, key: 'X' }), false)).toBe('strike');
    expect(matchShortcut(key({ ctrlKey: true, key: 'B' }), false)).toBe('bold');
  });

  it('matches paragraph styles by the physical key, so Option+digit on a Mac still works', () => {
    expect(matchShortcut(key({ metaKey: true, altKey: true, code: 'Digit0', key: 'º' }), true)).toBe('p');
    expect(matchShortcut(key({ metaKey: true, altKey: true, code: 'Digit1', key: '¡' }), true)).toBe('h1');
    expect(matchShortcut(key({ ctrlKey: true, altKey: true, code: 'Digit2', key: '2' }), false)).toBe('h2');
    expect(matchShortcut(key({ ctrlKey: true, altKey: true, code: 'Digit3', key: '3' }), false)).toBe('h3');
    expect(matchShortcut(key({ ctrlKey: true, altKey: true, key: 'c' }), false)).toBe('codeBlock');
  });

  it('matches lists, quote and clear formatting', () => {
    expect(matchShortcut(key({ ctrlKey: true, shiftKey: true, code: 'Digit8', key: '*' }), false)).toBe('bullets');
    expect(matchShortcut(key({ ctrlKey: true, shiftKey: true, code: 'Digit7', key: '&' }), false)).toBe('numbers');
    expect(matchShortcut(key({ ctrlKey: true, shiftKey: true, code: 'Digit9', key: '(' }), false)).toBe('quote');
    expect(matchShortcut(key({ ctrlKey: true, key: '\\' }), false)).toBe('clear');
  });

  it('ignores a key without the command key and one with extra modifiers', () => {
    expect(matchShortcut(key({ key: 'b' }), false)).toBeNull();
    expect(matchShortcut(key({ ctrlKey: true, shiftKey: true, key: 'b' }), false)).toBeNull();
    expect(matchShortcut(key({ ctrlKey: true, altKey: true, key: 'b' }), false)).toBeNull();
    expect(matchShortcut(key({ ctrlKey: true, metaKey: true, key: 'b' }), false)).toBeNull();
    expect(matchShortcut(key({ ctrlKey: true, key: 'z' }), false)).toBeNull();
  });

  it('gives every shortcut to exactly one command', () => {
    const seen = SHORTCUTS.map((s) => `${s.key || s.code}|${Boolean(s.shift)}|${Boolean(s.alt)}`);
    expect(new Set(seen).size).toBe(seen.length);
  });
});

describe('shortcutLabel', () => {
  it('writes shortcuts the way the platform does', () => {
    expect(shortcutLabel({ key: 'b' }, true)).toBe('⌘B');
    expect(shortcutLabel({ key: 'b' }, false)).toBe('Ctrl+B');
    expect(shortcutLabel({ key: 'x', shift: true }, true)).toBe('⇧⌘X');
    expect(shortcutLabel({ key: 'x', shift: true }, false)).toBe('Ctrl+Shift+X');
    expect(shortcutLabel({ code: 'Digit1', alt: true }, true)).toBe('⌥⌘1');
    expect(shortcutLabel({ code: 'Digit1', alt: true }, false)).toBe('Ctrl+Alt+1');
    expect(shortcutLabel(undefined, false)).toBe('');
  });
});

describe('markdownCommand', () => {
  it('turns the usual Markdown markers into styles', () => {
    expect(markdownCommand('#')).toBe('h1');
    expect(markdownCommand('##')).toBe('h2');
    expect(markdownCommand('###')).toBe('h3');
    expect(markdownCommand('>')).toBe('quote');
    expect(markdownCommand('-')).toBe('bullets');
    expect(markdownCommand('*')).toBe('bullets');
    expect(markdownCommand('1.')).toBe('numbers');
    expect(markdownCommand('12.')).toBe('numbers');
    expect(markdownCommand('```')).toBe('codeBlock');
  });

  it('leaves everything else alone', () => {
    ['', '####', 'a', '# a', '1', '.', '1.a', 'constructor', '__proto__'].forEach((text) => expect(markdownCommand(text)).toBeNull());
  });
});

describe('stylesAt', () => {
  const build = (html) => {
    const root = document.createElement('div');
    root.innerHTML = html;
    return root;
  };

  it('reads the paragraph style, list and inline styles around a point', () => {
    const root = build('<h2>a <strong><em>b</em></strong></h2><ul><li>c <code>d</code></li></ul>');
    const b = root.querySelector('em').firstChild;
    expect(stylesAt(b, root)).toEqual({ block: 'h2', list: null, marks: new Set(['bold', 'italic']) });
    const d = root.querySelector('code').firstChild;
    expect(stylesAt(d, root)).toEqual({ block: null, list: 'ul', marks: new Set(['code']) });
  });

  it('stops at the editor and handles no node', () => {
    const root = build('<p>a</p>');
    expect(stylesAt(root, root)).toEqual({ block: null, list: null, marks: new Set() });
    expect(stylesAt(null, root).block).toBeNull();
  });

  it('knows the old and new names of a mark', () => {
    const root = build('<p><b>a</b><i>b</i><strike>c</strike></p>');
    ['b', 'i', 'strike'].forEach((tag) => expect(stylesAt(root.querySelector(tag).firstChild, root).marks.size).toBe(1));
  });
});

describe('the lists of styles', () => {
  it('has the paragraph styles asked for', () => {
    expect(PARAGRAPH_STYLES.map((s) => s.value)).toEqual(['p', 'h1', 'h2', 'h3', 'blockquote', 'pre']);
    expect(INLINE_STYLES.map((s) => s.command)).toEqual(['bold', 'italic', 'underline', 'strike', 'code', 'link']);
    expect(LIST_STYLES.map((s) => s.list)).toEqual(['ul', 'ol']);
  });
});
