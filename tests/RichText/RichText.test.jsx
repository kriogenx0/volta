import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';

import RichText from '../../components/RichText/RichText';

// jsdom has no editing commands, so record what the editor asks the browser to do.
let exec;
beforeEach(() => {
  exec = jest.fn(() => true);
  document.execCommand = exec;
});
afterEach(() => { delete document.execCommand; });

const editor = () => screen.getByRole('textbox');

// Puts the caret at the end of an element's text
const caretAtEnd = (node) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const keyDown = (init) => {
  const event = createEvent.keyDown(editor(), { bubbles: true, cancelable: true, ...init });
  fireEvent(editor(), event);
  return event;
};

const calls = (name) => exec.mock.calls.filter(([command]) => command === name);

describe('RichText', () => {
  it('renders an editable, named text box and a toolbar', () => {
    render(<RichText aria-label="Notes" />);
    expect(editor()).toHaveAttribute('contenteditable', 'true');
    expect(editor()).toHaveAttribute('aria-multiline', 'true');
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Paragraph style' })).toBeInTheDocument();
    ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code', 'Link', 'Bulleted list', 'Numbered list', 'Clear formatting']
      .forEach((name) => expect(screen.getByRole('button', { name })).toBeInTheDocument());
  });

  it('offers every paragraph style', () => {
    render(<RichText aria-label="Notes" />);
    const labels = [...screen.getByRole('combobox', { name: 'Paragraph style' }).options].map((option) => option.textContent);
    expect(labels).toEqual(['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Quote', 'Code block']);
  });

  it('shows the value, cleaned', () => {
    render(<RichText aria-label="Notes" value={'<p onclick="x()">Hi <b>there</b></p><script>alert(1)</script>'} />);
    expect(editor().innerHTML).toBe('<p>Hi <strong>there</strong></p>');
  });

  it('starts from defaultValue', () => {
    render(<RichText aria-label="Notes" defaultValue="<h2>Title</h2>" />);
    expect(editor().innerHTML).toBe('<h2>Title</h2>');
  });

  it('follows a value that changes from outside', () => {
    const { rerender } = render(<RichText aria-label="Notes" value="<p>one</p>" />);
    rerender(<RichText aria-label="Notes" value="<p>two</p>" />);
    expect(editor().innerHTML).toBe('<p>two</p>');
  });

  it('shows the placeholder only while empty', () => {
    const { rerender } = render(<RichText aria-label="Notes" placeholder="Write..." value="" />);
    expect(editor()).toHaveAttribute('data-placeholder', 'Write...');
    expect(editor()).toHaveAttribute('data-empty');
    rerender(<RichText aria-label="Notes" placeholder="Write..." value="<p>Hi</p>" />);
    expect(editor()).not.toHaveAttribute('data-placeholder');
  });

  it('reports cleaned html as the user edits, and an empty string for no text', () => {
    const onChange = jest.fn();
    render(<RichText aria-label="Notes" onChange={onChange} />);

    editor().innerHTML = '<div><b>Hi</b></div><script>x()</script>';
    fireEvent.input(editor());
    expect(onChange).toHaveBeenLastCalledWith('<p><strong>Hi</strong></p>');

    editor().innerHTML = '<p><br></p>';
    fireEvent.input(editor());
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('does not report a change that is not one', () => {
    const onChange = jest.fn();
    render(<RichText aria-label="Notes" value="<p>Hi</p>" onChange={onChange} />);
    fireEvent.input(editor());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has no toolbar and cannot be edited when read only', () => {
    render(<RichText aria-label="Notes" readOnly defaultValue="<p>Hi</p>" />);
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(editor()).toHaveAttribute('contenteditable', 'false');
    expect(editor()).toHaveAttribute('aria-readonly', 'true');
    keyDown({ ctrlKey: true, key: 'b' });
    expect(exec).not.toHaveBeenCalled();
  });

  it('turns the toolbar off when disabled', () => {
    render(<RichText aria-label="Notes" disabled />);
    expect(editor()).toHaveAttribute('contenteditable', 'false');
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Paragraph style' })).toBeDisabled();
  });

  it('adds its class and the className it is given, and a minimum height', () => {
    const { container } = render(<RichText aria-label="Notes" className="extra" height={200} />);
    expect(container.firstChild).toHaveClass('volta-rich_text', 'extra');
    expect(editor()).toHaveStyle({ minHeight: '200px' });
  });

  it('passes other props to the editing area', () => {
    render(<RichText aria-label="Notes" data-qa="rt" />);
    expect(editor()).toHaveAttribute('data-qa', 'rt');
  });
});

describe('RichText toolbar', () => {
  it('runs the inline styles', () => {
    render(<RichText aria-label="Notes" />);
    const pairs = { Bold: 'bold', Italic: 'italic', Underline: 'underline', Strikethrough: 'strikeThrough' };
    Object.entries(pairs).forEach(([name, command]) => {
      fireEvent.click(screen.getByRole('button', { name }));
      expect(calls(command)).toHaveLength(1);
    });
  });

  it('runs the lists and clear formatting', () => {
    render(<RichText aria-label="Notes" />);
    fireEvent.click(screen.getByRole('button', { name: 'Bulleted list' }));
    fireEvent.click(screen.getByRole('button', { name: 'Numbered list' }));
    expect(calls('insertUnorderedList')).toHaveLength(1);
    expect(calls('insertOrderedList')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Clear formatting' }));
    expect(calls('removeFormat')).toHaveLength(1);
    expect(calls('unlink')).toHaveLength(1);
    expect(exec).toHaveBeenCalledWith('formatBlock', false, 'p');
  });

  it('sets a paragraph style from the select', () => {
    render(<RichText aria-label="Notes" />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Paragraph style' }), { target: { value: 'h2' } });
    expect(exec).toHaveBeenCalledWith('formatBlock', false, 'h2');
  });

  it('keeps the selection in the text when a button is pressed', () => {
    render(<RichText aria-label="Notes" />);
    const event = createEvent.mouseDown(screen.getByRole('button', { name: 'Bold' }), { bubbles: true, cancelable: true });
    fireEvent(screen.getByRole('button', { name: 'Bold' }), event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('marks the styles at the caret as on', () => {
    render(<RichText aria-label="Notes" defaultValue="<h2>a <strong>bold</strong></h2>" />);
    const text = editor().querySelector('strong').firstChild;
    const range = document.createRange();
    range.setStart(text, 2);
    range.collapse(true);
    act(() => {
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('combobox', { name: 'Paragraph style' })).toHaveValue('h2');
  });

  it('shows each button\'s shortcut in its tooltip', () => {
    render(<RichText aria-label="Notes" />);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('title', 'Bold (Ctrl+B)');
    expect(screen.getByRole('button', { name: 'Strikethrough' })).toHaveAttribute('title', 'Strikethrough (Ctrl+Shift+X)');
  });
});

describe('RichText keyboard shortcuts', () => {
  it('runs the inline styles', () => {
    render(<RichText aria-label="Notes" />);
    const event = keyDown({ ctrlKey: true, key: 'b' });
    expect(event.defaultPrevented).toBe(true);
    keyDown({ ctrlKey: true, key: 'i' });
    keyDown({ ctrlKey: true, key: 'u' });
    keyDown({ ctrlKey: true, shiftKey: true, key: 'X' });
    expect(calls('bold')).toHaveLength(1);
    expect(calls('italic')).toHaveLength(1);
    expect(calls('underline')).toHaveLength(1);
    expect(calls('strikeThrough')).toHaveLength(1);
  });

  it('sets the paragraph styles', () => {
    render(<RichText aria-label="Notes" />);
    keyDown({ ctrlKey: true, altKey: true, code: 'Digit1', key: '1' });
    keyDown({ ctrlKey: true, altKey: true, code: 'Digit2', key: '2' });
    keyDown({ ctrlKey: true, altKey: true, code: 'Digit3', key: '3' });
    keyDown({ ctrlKey: true, altKey: true, code: 'Digit0', key: '0' });
    keyDown({ ctrlKey: true, shiftKey: true, code: 'Digit9', key: '(' });
    keyDown({ ctrlKey: true, altKey: true, key: 'c' });
    expect(calls('formatBlock').map(([, , arg]) => arg)).toEqual(['h1', 'h2', 'h3', 'p', 'blockquote', 'pre']);
  });

  it('makes lists', () => {
    render(<RichText aria-label="Notes" />);
    keyDown({ ctrlKey: true, shiftKey: true, code: 'Digit8', key: '*' });
    keyDown({ ctrlKey: true, shiftKey: true, code: 'Digit7', key: '&' });
    expect(calls('insertUnorderedList')).toHaveLength(1);
    expect(calls('insertOrderedList')).toHaveLength(1);
  });

  it('leaves other keys to the browser', () => {
    render(<RichText aria-label="Notes" />);
    const event = keyDown({ ctrlKey: true, key: 'z' });
    expect(event.defaultPrevented).toBe(false);
    keyDown({ key: 'b' });
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('RichText Markdown shortcuts', () => {
  const typeSpaceAfter = (marker, html = `<p>${marker}</p>`) => {
    render(<RichText aria-label="Notes" defaultValue={html} />);
    caretAtEnd(editor().firstChild);
    return keyDown({ key: ' ' });
  };

  it.each([
    ['#', 'h1'], ['##', 'h2'], ['###', 'h3'], ['>', 'blockquote'], ['```', 'pre']
  ])('turns "%s " into %s', (marker, tag) => {
    const event = typeSpaceAfter(marker);
    expect(event.defaultPrevented).toBe(true);
    expect(calls('delete')).toHaveLength(marker.length);
    expect(exec).toHaveBeenCalledWith('formatBlock', false, tag);
  });

  it('turns "- " and "* " into a bulleted list and "1. " into a numbered one', () => {
    typeSpaceAfter('-');
    expect(calls('insertUnorderedList')).toHaveLength(1);
  });

  it('turns "1. " into a numbered list', () => {
    typeSpaceAfter('1.');
    expect(calls('insertOrderedList')).toHaveLength(1);
    expect(calls('delete')).toHaveLength(2);
  });

  it('does nothing for a marker that is not at the start of text', () => {
    const event = typeSpaceAfter('word #', '<p>word #</p>');
    expect(event.defaultPrevented).toBe(false);
    expect(exec).not.toHaveBeenCalled();
  });

  it('does nothing inside a heading or a list', () => {
    const event = typeSpaceAfter('#', '<h2>#</h2>');
    expect(event.defaultPrevented).toBe(false);
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('RichText paste and drop', () => {
  const paste = (data) => {
    const event = createEvent.paste(editor(), { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: (type) => data[type] || '' } });
    fireEvent(editor(), event);
    return event;
  };

  it('inserts pasted html cleaned', () => {
    render(<RichText aria-label="Notes" />);
    const event = paste({ 'text/html': '<p onclick="x()">Hi</p><img src=x onerror="alert(1)"><script>x()</script>' });
    expect(event.defaultPrevented).toBe(true);
    expect(exec).toHaveBeenCalledWith('insertHTML', false, '<p>Hi</p>');
  });

  it('inserts pasted plain text as escaped paragraphs', () => {
    render(<RichText aria-label="Notes" />);
    paste({ 'text/plain': 'one <b>\ntwo\n\nthree' });
    expect(exec).toHaveBeenCalledWith('insertHTML', false, '<p>one &lt;b&gt;<br>two</p><p>three</p>');
  });

  it('keeps a single line of plain text inline', () => {
    render(<RichText aria-label="Notes" />);
    paste({ 'text/plain': 'just a line' });
    expect(exec).toHaveBeenCalledWith('insertHTML', false, 'just a line');
  });

  it('cleans dropped content the same way', () => {
    render(<RichText aria-label="Notes" />);
    const event = createEvent.drop(editor(), { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: { getData: (type) => ({ 'text/html': '<b onmouseover="x()">hi</b>' }[type] || '') } });
    fireEvent(editor(), event);
    expect(event.defaultPrevented).toBe(true);
    expect(exec).toHaveBeenCalledWith('insertHTML', false, '<strong>hi</strong>');
  });

  it('does not paste into a read only editor', () => {
    render(<RichText aria-label="Notes" readOnly />);
    paste({ 'text/html': '<p>x</p>' });
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('RichText links', () => {
  const openLink = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    return screen.getByRole('textbox', { name: 'Link address' });
  };
  const select = (node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    act(() => { document.dispatchEvent(new Event('selectionchange')); });
  };

  it('opens a link box from the button and from Cmd/Ctrl+K', () => {
    render(<RichText aria-label="Notes" />);
    keyDown({ ctrlKey: true, key: 'k' });
    expect(screen.getByRole('textbox', { name: 'Link address' })).toBeInTheDocument();
  });

  it('links the selection to a web address, adding https:// when it is left off', () => {
    render(<RichText aria-label="Notes" defaultValue="<p>Visit us</p>" />);
    select(editor().firstChild);
    fireEvent.change(openLink(), { target: { value: 'example.com/a' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(exec).toHaveBeenCalledWith('createLink', false, 'https://example.com/a');
    expect(screen.queryByRole('textbox', { name: 'Link address' })).toBeNull();
  });

  it('writes the address as the text when nothing is selected', () => {
    render(<RichText aria-label="Notes" />);
    fireEvent.change(openLink(), { target: { value: 'me@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(exec).toHaveBeenCalledWith('insertHTML', false, '<a href="mailto:me@example.com">me@example.com</a>');
  });

  it('refuses an address that could run a script', () => {
    render(<RichText aria-label="Notes" />);
    fireEvent.change(openLink(), { target: { value: 'javascript:alert(1)' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(calls('createLink')).toHaveLength(0);
    expect(calls('insertHTML')).toHaveLength(0);
    expect(screen.getByText('Enter a web, email or phone address')).toBeInTheDocument();
  });

  it('cancels with the button and with Escape', () => {
    render(<RichText aria-label="Notes" />);
    openLink();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('textbox', { name: 'Link address' })).toBeNull();
    fireEvent.keyDown(openLink(), { key: 'Escape' });
    expect(screen.queryByRole('textbox', { name: 'Link address' })).toBeNull();
  });

  it('edits and removes an existing link', () => {
    render(<RichText aria-label="Notes" defaultValue='<p><a href="https://old.example">link</a></p>' />);
    select(editor().querySelector('a').firstChild);
    expect(openLink()).toHaveValue('https://old.example');
    fireEvent.click(screen.getByRole('button', { name: 'Remove link' }));
    expect(calls('unlink')).toHaveLength(1);
  });
});

describe('RichText inline code', () => {
  it('wraps the selected text in code, and takes it out again', () => {
    render(<RichText aria-label="Notes" defaultValue="<p>use ls now</p>" />);
    const text = editor().firstChild.firstChild;
    const range = document.createRange();
    range.setStart(text, 4);
    range.setEnd(text, 6);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    act(() => { document.dispatchEvent(new Event('selectionchange')); });
    fireEvent.click(screen.getByRole('button', { name: 'Code' }));
    expect(exec).toHaveBeenCalledWith('insertHTML', false, '<code>ls</code>');
  });
});

describe('RichText click to edit', () => {
  it('shows the text as a button, opens the editor on click and closes it on Escape', () => {
    const onBlur = jest.fn();
    render(<RichText aria-label="Notes" editOnClick defaultValue="<p>Hi</p>" onBlur={onBlur} />);
    expect(screen.queryByRole('toolbar')).toBeNull();
    const closed = screen.getByRole('button');
    expect(closed).toHaveAttribute('contenteditable', 'false');

    fireEvent.click(closed);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(editor()).toHaveAttribute('contenteditable', 'true');

    fireEvent.keyDown(editor(), { key: 'Escape' });
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens with Enter and with Space', () => {
    render(<RichText aria-label="Notes" editOnClick defaultValue="<p>Hi</p>" />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('is reachable by the keyboard while closed', () => {
    render(<RichText aria-label="Notes" editOnClick defaultValue="<p>Hi</p>" />);
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
  });

  it('says "Click to edit" while empty and closed', () => {
    render(<RichText aria-label="Notes" editOnClick />);
    expect(screen.getByRole('button')).toHaveAttribute('data-placeholder', 'Click to edit');
  });

  it('stays closed when read only or disabled', () => {
    const { rerender } = render(<RichText aria-label="Notes" editOnClick readOnly defaultValue="<p>Hi</p>" />);
    fireEvent.click(editor());
    expect(screen.queryByRole('toolbar')).toBeNull();
    rerender(<RichText aria-label="Notes" editOnClick disabled defaultValue="<p>Hi</p>" />);
    fireEvent.click(editor());
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(editor()).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('RichText onBlur', () => {
  it('reports the html when focus leaves, but not when it moves to the toolbar', () => {
    const onBlur = jest.fn();
    render(<RichText aria-label="Notes" defaultValue="<p>Hi</p>" onBlur={onBlur} />);
    fireEvent.blur(editor(), { relatedTarget: screen.getByRole('button', { name: 'Bold' }) });
    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(editor(), { relatedTarget: document.body });
    expect(onBlur).toHaveBeenCalledWith('<p>Hi</p>');
  });
});
