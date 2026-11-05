import { render, waitFor } from '@testing-library/react';

import RichTextQuill from '../../components/RichTextQuill/RichTextQuill';

describe('RichTextQuill', () => {
  it('renders without crashing', () => {
    const { container } = render(<RichTextQuill />);
    expect(container).toBeInTheDocument();
  });

  it('shows the toolbar and an editable area', () => {
    const { container } = render(<RichTextQuill />);
    expect(container.querySelector('.ql-toolbar')).toBeInTheDocument();
    expect(container.querySelector('.ql-editor')).toHaveAttribute('contenteditable', 'true');
    expect(container.querySelector('.ql-bold')).toBeInTheDocument();
    expect(container.querySelector('.ql-link')).toBeInTheDocument();
  });

  it('adds its own class and the className it is given', () => {
    const { container } = render(<RichTextQuill className="extra" />);
    expect(container.querySelector('.quill')).toHaveClass('volta-rich_text_quill', 'extra');
  });

  it('shows the placeholder while empty', () => {
    const { container } = render(<RichTextQuill placeholder="Write something..." />);
    expect(container.querySelector('.ql-editor')).toHaveAttribute('data-placeholder', 'Write something...');
  });

  it('shows the value it is given as formatted content', () => {
    const { container } = render(<RichTextQuill value="<p>Hello <strong>world</strong></p>" />);
    const editor = container.querySelector('.ql-editor');
    expect(editor).toHaveTextContent('Hello world');
    expect(editor.querySelector('strong')).toHaveTextContent('world');
  });

  it('shows defaultValue without being controlled', () => {
    const { container } = render(<RichTextQuill defaultValue="<h2>Title</h2>" />);
    expect(container.querySelector('.ql-editor h2')).toHaveTextContent('Title');
  });

  it('is not editable when readOnly', () => {
    const { container } = render(<RichTextQuill readOnly value="<p>Locked</p>" />);
    expect(container.querySelector('.ql-editor')).toHaveAttribute('contenteditable', 'false');
  });

  it('always uses the fixed toolbar, ignoring a modules prop', () => {
    const { container } = render(<RichTextQuill modules={{ toolbar: false }} />);
    expect(container.querySelector('.ql-toolbar')).toBeInTheDocument();
  });

  it('calls onChange with the new html when the content changes', async () => {
    const onChange = jest.fn();
    const { container } = render(<RichTextQuill defaultValue="<p>Hello</p>" onChange={onChange} />);
    const paragraph = container.querySelector('.ql-editor p');

    paragraph.textContent = 'Goodbye';
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0]).toBe('<p>Goodbye</p>');
  });
});
