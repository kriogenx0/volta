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

  describe('options', () => {
    it('passes nothing extra when none is given', () => {
      render(<RichTextTinyMCE />);
      const props = lastProps();
      expect(props.disabled).toBeUndefined();
      expect(props.readonly).toBeUndefined();
      expect(props.init).not.toHaveProperty('placeholder');
      expect(props.init).not.toHaveProperty('height');
    });

    it('passes disabled and readonly to the editor, which follows them as they change', () => {
      const { rerender } = render(<RichTextTinyMCE disabled />);
      expect(lastProps().disabled).toBe(true);
      expect(lastProps().readonly).toBeUndefined();

      rerender(<RichTextTinyMCE readonly />);
      expect(lastProps().readonly).toBe(true);
      expect(lastProps().disabled).toBeUndefined();
    });

    it('passes placeholder to TinyMCE\'s init', () => {
      render(<RichTextTinyMCE placeholder="Write something" />);
      expect(lastProps().init.placeholder).toBe('Write something');
    });

    it.each([[300], ['40vh']])('passes a height of %p to TinyMCE\'s init', (height) => {
      render(<RichTextTinyMCE height={height} />);
      expect(lastProps().init.height).toBe(height);
    });

    it('keeps an empty placeholder, which switches an inherited one off', () => {
      render(<RichTextTinyMCE placeholder="" init={{ placeholder: 'From init' }} />);
      expect(lastProps().init.placeholder).toBe('');
    });

    it('serves TinyMCE\'s script from tinymceScriptSrc', () => {
      render(<RichTextTinyMCE tinymceScriptSrc="/assets/tinymce/tinymce.min.js" />);
      expect(lastProps().tinymceScriptSrc).toBe('/assets/tinymce/tinymce.min.js');
    });

    it('adds any other TinyMCE option from init, over the defaults', () => {
      render(<RichTextTinyMCE init={{ skin: 'oxide-dark', content_css: 'dark', toolbar: 'bold' }} />);
      const { init } = lastProps();
      expect(init.skin).toBe('oxide-dark');
      expect(init.content_css).toBe('dark');
      expect(init.toolbar).toBe('bold');
      expect(init.plugins.split(' ')).toEqual(['link', 'image', 'code']);
    });

    it('lets the options of its own win over init', () => {
      render(<RichTextTinyMCE height={500} placeholder="Mine" init={{ height: 100, placeholder: 'Theirs' }} />);
      expect(lastProps().init.height).toBe(500);
      expect(lastProps().init.placeholder).toBe('Mine');
    });

    it('does not pass its own options to the editor as props it would ignore', () => {
      render(<RichTextTinyMCE placeholder="x" height={1} className="mine" />);
      const props = lastProps();
      expect(props).not.toHaveProperty('placeholder');
      expect(props).not.toHaveProperty('height');
      expect(props).not.toHaveProperty('className');
    });
  });

  describe('the wrapper', () => {
    it('has the component class, and the editor sits inside it', () => {
      const { container } = render(<RichTextTinyMCE />);
      expect(container.firstChild).toHaveClass('volta-rich_text_tinymce');
    });

    it('takes a className, which the editor itself would have ignored', () => {
      const { container } = render(<RichTextTinyMCE className="mine" />);
      expect(container.firstChild).toHaveClass('volta-rich_text_tinymce', 'mine');
    });
  });
});
