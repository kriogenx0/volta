import { render, fireEvent } from '@testing-library/react';

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
});
