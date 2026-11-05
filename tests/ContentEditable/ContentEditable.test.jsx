import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ContentEditable from '../../components/ContentEditable/ContentEditable';

describe('ContentEditable', () => {
  it('renders the given html', () => {
    const { container } = render(<ContentEditable html="<b>Hello</b>" onChange={() => {}} />);
    expect(container.firstChild.innerHTML).toBe('<b>Hello</b>');
  });

  it('is editable', () => {
    const { container } = render(<ContentEditable html="Hello" onChange={() => {}} />);
    expect(container.firstChild).toHaveAttribute('contenteditable');
  });

  it('calls onChange with the new innerHTML on input', () => {
    const onChange = jest.fn();
    const { container } = render(<ContentEditable html="Hello" onChange={onChange} />);
    container.firstChild.innerHTML = 'Goodbye';
    fireEvent.input(container.firstChild);
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'Goodbye' } });
  });

  it('does not call onChange when content is unchanged', () => {
    const onChange = jest.fn();
    const { container } = render(<ContentEditable html="Hello" onChange={onChange} />);
    fireEvent.input(container.firstChild);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders empty, without any html', () => {
    const { container } = render(<ContentEditable />);
    expect(container.firstChild.innerHTML).toBe('');
  });

  it('does not need an onChange', () => {
    const { container } = render(<ContentEditable html="Hello" />);
    container.firstChild.innerHTML = 'Goodbye';
    fireEvent.input(container.firstChild);
    fireEvent.blur(container.firstChild);
  });

  it('reports a change made before it loses focus, once', () => {
    const onChange = jest.fn();
    const { container } = render(<ContentEditable html="Hello" onChange={onChange} />);
    container.firstChild.innerHTML = 'Goodbye';
    fireEvent.blur(container.firstChild);
    fireEvent.blur(container.firstChild);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'Goodbye' } });
  });

  it('is a labelled multi-line textbox and adds a className', () => {
    render(<ContentEditable html="Hello" aria-label="Message" className="extra" />);
    const textbox = screen.getByRole('textbox', { name: 'Message' });
    expect(textbox).toHaveAttribute('aria-multiline', 'true');
    expect(textbox).toHaveClass('volta-content_editable', 'extra');
  });

  describe('as a controlled field', () => {
    const Controlled = ({ initial = 'Hello' }) => {
      const [html, setHtml] = useState(initial);
      return (
        <>
          <ContentEditable aria-label="Message" html={html} onChange={(e) => setHtml(e.target.value)} />
          <button type="button" onClick={() => setHtml('Replaced')}>Replace</button>
        </>
      );
    };

    it('leaves the content in place while the user types, so the caret does not jump', () => {
      render(<Controlled />);
      const textbox = screen.getByRole('textbox');
      const text = textbox.firstChild;

      text.nodeValue = 'Hello!';
      fireEvent.input(textbox);
      expect(textbox.innerHTML).toBe('Hello!');
      expect(textbox.firstChild).toBe(text);
    });

    it('writes html changed from outside', () => {
      render(<Controlled />);
      fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
      expect(screen.getByRole('textbox').innerHTML).toBe('Replaced');
    });

    it('writes outside changes after the user has typed', () => {
      render(<Controlled />);
      const textbox = screen.getByRole('textbox');
      textbox.firstChild.nodeValue = 'Hello!';
      fireEvent.input(textbox);

      fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
      expect(textbox.innerHTML).toBe('Replaced');
    });
  });
});
