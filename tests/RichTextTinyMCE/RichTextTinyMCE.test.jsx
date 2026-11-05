import { render } from '@testing-library/react';

import RichTextTinyMCE from '../../components/RichTextTinyMCE/RichTextTinyMCE';

// TinyMCE itself loads from a script tag, which jsdom never fetches, so the editor
// UI can't appear here. These tests cover what the wrapper hands to the editor.
const mockEditor = jest.fn(() => null);

jest.mock('@tinymce/tinymce-react', () => ({
  Editor: (props) => mockEditor(props)
}));

const lastProps = () => mockEditor.mock.calls[mockEditor.mock.calls.length - 1][0];

describe('RichTextTinyMCE', () => {
  beforeEach(() => {
    mockEditor.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<RichTextTinyMCE />);
    expect(container).toBeInTheDocument();
  });

  it('is self-hosted under the GPL license, with no cloud api key', () => {
    render(<RichTextTinyMCE />);
    const props = lastProps();
    expect(props.tinymceScriptSrc).toBe('tinymce/tinymce.min.js');
    expect(props.licenseKey).toBe('gpl');
    expect(props.init.license_key).toBe('gpl');
    expect(props.apiKey).toBeUndefined();
  });

  it('passes value through and reports edits with onChange', () => {
    const onChange = jest.fn();
    render(<RichTextTinyMCE value="<p>Hello</p>" onChange={onChange} />);
    const props = lastProps();
    expect(props.value).toBe('<p>Hello</p>');

    props.onEditorChange('<p>Goodbye</p>', {});
    expect(onChange).toHaveBeenCalledWith('<p>Goodbye</p>', {});
  });

  it('works without a value or an onChange', () => {
    render(<RichTextTinyMCE />);
    const props = lastProps();
    expect(props.value).toBeUndefined();
    expect(props.onEditorChange).toBeUndefined();
  });

  it('gives the editor the link, image and code plugins and a toolbar to use them', () => {
    render(<RichTextTinyMCE />);
    const { init } = lastProps();
    expect(init.plugins.split(' ')).toEqual(['link', 'image', 'code']);
    expect(init.toolbar).toEqual(expect.stringContaining('bold italic'));
    expect(init.toolbar).toEqual(expect.stringContaining('code'));
  });
});
