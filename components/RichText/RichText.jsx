import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { asButton } from '../../util/keyboard';
import { safeHref, sanitizeHtml } from '../../util/sanitizeHtml';
import Button from '../Button/Button';
import NativeSelect from '../NativeSelect/NativeSelect';
import TextBox from '../TextBox/TextBox';
import {
  CLEAR_STYLE, INLINE_STYLES, LIST_STYLES, PARAGRAPH_STYLES,
  markdownCommand, matchShortcut, shortcutLabel, stylesAt
} from './richTextCommands';

import './RichText.scss';

// A rich text editor with no editing library: a contentEditable area and a toolbar.
// Formatting is done with document.execCommand, so the browser's own undo and redo
// keep working. The HTML it reports is always cleaned by sanitizeHtml, and so is
// whatever is pasted or dropped in (docs/features/rich_text.md).

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');

const exec = (command, arg) => (typeof document.execCommand === 'function' ? document.execCommand(command, false, arg) : false);

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Plain text pasted in: blank lines separate paragraphs, a single line stays inline.
const textToHtml = (text) => {
  const paragraphs = text.replace(/\r\n?/g, '\n').split(/\n{2,}/).filter((p) => p !== '');
  const html = paragraphs.map((p) => escapeHtml(p).replace(/\n/g, '<br>'));
  return html.length > 1 ? html.map((p) => `<p>${p}</p>`).join('') : html.join('');
};

// What the user typed in the link box, as an address: add https:// to "example.com"
// and mailto: to "me@example.com".
const toAddress = (text) => {
  const value = text.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || /^[/#?]/.test(value)) return value;
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(value)) return `mailto:${value}`;
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(value)) return `https://${value}`;
  return value;
};

const BLOCKS = ['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'PRE', 'LI'];

const closest = (node, root, names) => {
  for (let n = node; n && n !== root; n = n.parentNode) {
    if (n.nodeType === 1 && names.includes(n.nodeName)) return n;
  }
  return null;
};

const NO_STYLES = { block: null, list: null, marks: [] };

const RichText = ({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  readOnly = false,
  editOnClick = false,
  height,
  className,
  ...otherProps
}) => {
  const rootRef = useRef(null);
  const editorRef = useRef(null);
  const linkInputRef = useRef(null);
  const saved = useRef(null); // the last selection inside the editor
  const mac = isMac();

  // React is only given the first html. If it saw every change it would rewrite the
  // element as the user types and the caret would jump; later changes from outside
  // are written by the effect below.
  const [initialHtml] = useState(() => ({ __html: sanitizeHtml(value ?? defaultValue) }));
  const last = useRef(initialHtml.__html);
  const [empty, setEmpty] = useState(() => !initialHtml.__html.replace(/<[^>]*>/g, '').trim());
  const [editing, setEditing] = useState(!editOnClick);
  const [active, setActive] = useState(NO_STYLES);
  const [link, setLink] = useState(null); // { url, existing, error } while the link box is open

  const editable = editing && !readOnly && !disabled;

  const inEditor = (node) => Boolean(node && editorRef.current && editorRef.current.contains(node));

  const remember = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount && inEditor(selection.anchorNode)) saved.current = selection.getRangeAt(0).cloneRange();
  };

  // Puts the caret back where it was, for a command run from the toolbar or the link box.
  const restore = () => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement !== el) el.focus();
    const selection = window.getSelection();
    if (saved.current && selection && inEditor(saved.current.startContainer)) {
      selection.removeAllRanges();
      selection.addRange(saved.current);
    }
  };

  const refreshStyles = () => {
    const selection = window.getSelection();
    if (!selection || !inEditor(selection.anchorNode)) return;
    const found = stylesAt(selection.anchorNode, editorRef.current);
    const next = { block: found.block, list: found.list, marks: [...found.marks] };
    setActive((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  };

  // The html the editor holds, cleaned. Tells the parent when it changed.
  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    const blank = !el.textContent.trim() && !el.querySelector('li');
    setEmpty(blank);
    const clean = blank ? '' : sanitizeHtml(el.innerHTML);
    if (clean !== last.current) {
      last.current = clean;
      if (onChange) onChange(clean);
    }
  };

  useEffect(() => {
    if (value === undefined || !editorRef.current) return;
    const clean = sanitizeHtml(value);
    if (clean !== last.current) {
      editorRef.current.innerHTML = clean;
      last.current = clean;
      setEmpty(!editorRef.current.textContent.trim() && !editorRef.current.querySelector('li'));
    }
  }, [value]);

  useEffect(() => {
    if (!editable) return undefined;
    const onSelectionChange = () => { remember(); refreshStyles(); };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [editable]);

  // Click to edit: move into the editor once it opens, with the caret at the end.
  useEffect(() => {
    if (!editOnClick || !editing || !editorRef.current) return;
    const el = editorRef.current;
    el.focus();
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [editing]);

  useEffect(() => {
    if (link && linkInputRef.current) linkInputRef.current.focus();
  }, [Boolean(link)]);

  const setBlock = (tag) => {
    // Quote and code block toggle: choosing the one already on goes back to a paragraph
    exec('formatBlock', active.block === tag && tag !== 'p' ? 'p' : tag);
  };

  const toggleCode = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const code = closest(selection.anchorNode, editorRef.current, ['CODE']);
    if (code) {
      const range = document.createRange();
      range.selectNode(code);
      selection.removeAllRanges();
      selection.addRange(range);
      exec('insertText', code.textContent);
      return;
    }
    const text = selection.toString();
    if (text) exec('insertHTML', `<code>${escapeHtml(text)}</code>`);
  };

  const openLink = () => {
    const selection = window.getSelection();
    const anchor = selection && closest(selection.anchorNode, editorRef.current, ['A']);
    setLink({ url: anchor ? anchor.getAttribute('href') || '' : '', existing: Boolean(anchor), error: '' });
  };

  const closeLink = () => {
    setLink(null);
    restore();
  };

  const applyLink = (event) => {
    event.preventDefault();
    const href = safeHref(toAddress(link.url));
    if (!href) {
      setLink({ ...link, error: 'Enter a web, email or phone address' });
      return;
    }
    setLink(null);
    restore();
    const selection = window.getSelection();
    if (selection && selection.isCollapsed && !link.existing) {
      exec('insertHTML', `<a href="${escapeHtml(href)}">${escapeHtml(link.url.trim())}</a>`);
    } else {
      exec('createLink', href);
    }
    emit();
    refreshStyles();
  };

  const removeLink = () => {
    setLink(null);
    restore();
    exec('unlink');
    emit();
    refreshStyles();
  };

  const run = (command) => {
    const paragraph = PARAGRAPH_STYLES.find((style) => style.command === command);
    if (paragraph) { setBlock(paragraph.tag); return; }
    switch (command) {
      case 'bold': exec('bold'); break;
      case 'italic': exec('italic'); break;
      case 'underline': exec('underline'); break;
      case 'strike': exec('strikeThrough'); break;
      case 'code': toggleCode(); break;
      case 'link': openLink(); return; // finished by the link box
      case 'bullets': exec('insertUnorderedList'); break;
      case 'numbers': exec('insertOrderedList'); break;
      case 'clear':
        exec('removeFormat');
        exec('unlink');
        exec('formatBlock', 'p');
        break;
      default: return;
    }
  };

  // A command from the toolbar, the style select or a shortcut.
  const apply = (command) => {
    if (!editable) return;
    if (document.activeElement !== editorRef.current) restore();
    run(command);
    emit();
    refreshStyles();
  };

  // "# " at the start of a line turns it into a heading, "- " into a list, and so on.
  const tryMarkdown = (event) => {
    const selection = window.getSelection();
    if (!selection || !selection.isCollapsed || !selection.rangeCount) return false;
    const root = editorRef.current;
    const block = closest(selection.anchorNode, root, BLOCKS) || root;
    if (block !== root && !['P', 'DIV'].includes(block.nodeName)) return false;

    const range = document.createRange();
    range.selectNodeContents(block);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    const text = range.toString();
    const command = markdownCommand(text);
    if (!command) return false;

    event.preventDefault();
    for (let i = 0; i < text.length; i += 1) exec('delete');
    run(command);
    emit();
    refreshStyles();
    return true;
  };

  // Click to edit: before the editor opens, the area is a button that Enter and Space press.
  const opener = !editing && !readOnly && !disabled ? asButton(() => setEditing(true)) : null;

  const handleKeyDown = (event) => {
    if (opener) {
      opener.onKeyDown(event);
      return;
    }
    if (!editable) return;
    const command = matchShortcut(event, mac);
    if (command) {
      event.preventDefault();
      apply(command);
      return;
    }
    if (event.key === ' ' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      tryMarkdown(event);
      return;
    }
    if (event.key === 'Escape' && editOnClick) {
      editorRef.current.blur();
      setEditing(false);
    }
  };

  // Pasted or dropped content goes in as cleaned html, or as plain text.
  const insertFrom = (data) => {
    const html = data.getData('text/html');
    const text = data.getData('text/plain');
    const clean = html ? sanitizeHtml(html) : textToHtml(text);
    if (clean) exec('insertHTML', clean);
    emit();
  };

  const handlePaste = (event) => {
    if (!editable) return;
    event.preventDefault();
    insertFrom(event.clipboardData);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (editable && event.dataTransfer) insertFrom(event.dataTransfer);
  };

  const handleFocus = () => {
    if (editable) exec('defaultParagraphSeparator', 'p');
  };

  // Focus leaving the whole editor (not just moving to the toolbar) finishes an edit.
  const handleBlur = (event) => {
    if (rootRef.current && rootRef.current.contains(event.relatedTarget)) return;
    if (onBlur) onBlur(last.current);
    if (editOnClick) {
      setEditing(false);
      setLink(null);
    }
  };

  // Keeps the selection in the text when a toolbar button is pressed.
  const keepSelection = (event) => {
    if (!event.target.closest('select, input')) event.preventDefault();
  };

  const button = (item) => {
    const on = item.list ? active.list === item.list : active.marks.includes(item.command);
    const keys = shortcutLabel(item.shortcut, mac);
    return (
      <Button
        key={item.command}
        size="tiny"
        disabled={disabled}
        className={`volta-rich_text-tool volta-rich_text-tool--${item.command}${on ? ' volta-rich_text-tool--on' : ''}`}
        aria-pressed={on}
        aria-label={item.label}
        title={keys ? `${item.label} (${keys})` : item.label}
        onClick={() => apply(item.command)}
      >
        {item.text}
      </Button>
    );
  };

  const showToolbar = editing && !readOnly;
  const showPlaceholder = empty && (placeholder !== undefined || editOnClick);

  return (
    <div
      ref={rootRef}
      className={`volta-rich_text${editable ? '' : ' volta-rich_text--static'}${disabled ? ' volta-rich_text--disabled' : ''}${className ? ` ${className}` : ''}`}
      onBlur={handleBlur}
    >
      {showToolbar && (
        <div className="volta-rich_text-toolbar" role="toolbar" aria-label="Formatting" onMouseDown={keepSelection}>
          <NativeSelect
            fieldSize="sm"
            aria-label="Paragraph style"
            disabled={disabled}
            value={active.block || 'p'}
            options={PARAGRAPH_STYLES.map((style) => ({ value: style.value, label: style.label }))}
            onChange={(event) => apply(PARAGRAPH_STYLES.find((style) => style.value === event.target.value).command)}
          />
          <div className="volta-rich_text-group" role="group" aria-label="Text style">
            {INLINE_STYLES.map(button)}
          </div>
          <div className="volta-rich_text-group" role="group" aria-label="Lists">
            {LIST_STYLES.map(button)}
          </div>
          {button(CLEAR_STYLE)}
        </div>
      )}

      {link && (
        <form
          className="volta-rich_text-link"
          onSubmit={applyLink}
          onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); closeLink(); } }}
        >
          <TextBox
            ref={linkInputRef}
            aria-label="Link address"
            placeholder="https://example.com"
            value={link.url}
            error={link.error || undefined}
            onChange={(event) => setLink({ ...link, url: event.target.value, error: '' })}
            wrapperClassName="volta-rich_text-link-input"
          />
          <Button type="submit" variant="primary" size="tiny">Apply</Button>
          {link.existing && <Button size="tiny" onClick={removeLink}>Remove link</Button>}
          <Button size="tiny" onClick={closeLink}>Cancel</Button>
        </form>
      )}

      <div
        role={opener ? 'button' : 'textbox'}
        aria-multiline={opener ? undefined : 'true'}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        {...otherProps}
        ref={editorRef}
        className="volta-rich_text-content"
        contentEditable={editable}
        suppressContentEditableWarning
        tabIndex={editable || opener ? 0 : undefined}
        onClick={opener ? opener.onClick : undefined}
        data-placeholder={showPlaceholder ? (placeholder ?? 'Click to edit') : undefined}
        data-empty={empty ? '' : undefined}
        // The minimum height is a runtime value, so it has to be inline
        style={height !== undefined ? { minHeight: height } : undefined}
        onInput={emit}
        onKeyDown={handleKeyDown}
        onKeyUp={refreshStyles}
        onMouseUp={refreshStyles}
        onFocus={handleFocus}
        onPaste={handlePaste}
        onDrop={handleDrop}
        dangerouslySetInnerHTML={initialHtml}
      />
    </div>
  );
};

RichText.propTypes = {
  // The html to show. The editor is controlled by it; it is cleaned before use.
  value: PropTypes.string,
  // The html to start with when `value` is not given
  defaultValue: PropTypes.string,
  // Called with the new (cleaned) html as the user edits; '' when there is no text
  onChange: PropTypes.func,
  // Called with the html when focus leaves the editor
  onBlur: PropTypes.func,
  // Grey text shown while the editor is empty
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  // Shows the content without a toolbar and doesn't let it be edited
  readOnly: PropTypes.bool,
  // Shows the content as text; a click (or Enter) opens the editor, and leaving it closes it
  editOnClick: PropTypes.bool,
  // The editing area's minimum height: a number of pixels, or any CSS length
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string
};

export { RichText };
export default RichText;
