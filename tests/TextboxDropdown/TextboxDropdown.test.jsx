import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TextboxDropdown from '../../components/TextboxDropdown/TextboxDropdown';
import TextBox from '../../components/TextBox/TextBox';

const box = () => screen.getByRole('textbox', { name: 'Fruit' });
const panel = () => screen.queryByRole('dialog', { name: 'Choices', hidden: false });

const Basic = (props) => (
  <>
    <button type="button">Elsewhere</button>
    <TextboxDropdown panelLabel="Choices" textbox={<TextBox label="Fruit" />} {...props}>
      <button type="button">Apple</button>
      <p>Some text</p>
    </TextboxDropdown>
  </>
);

describe('TextboxDropdown', () => {
  it('renders the textbox and keeps the panel closed at first', () => {
    render(<Basic />);
    expect(box()).toHaveAttribute('aria-expanded', 'false');
    expect(box()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
  });

  it('opens when the textbox gets focus, and says so for assistive technology', () => {
    render(<Basic />);
    fireEvent.focus(box());
    expect(document.querySelector('.volta-dropdown')).toHaveClass('is-open');
    expect(box()).toHaveAttribute('aria-expanded', 'true');
    expect(box().getAttribute('aria-controls')).toBe(screen.getByRole('dialog', { name: 'Choices' }).id);
  });

  it('opens on a click, and keeps the textbox\'s own handlers', () => {
    const onFocus = jest.fn();
    render(<Basic textbox={<TextBox label="Fruit" onFocus={onFocus} />} />);
    fireEvent.click(box());
    expect(document.querySelector('.volta-dropdown')).toHaveClass('is-open');
    fireEvent.focus(box());
    expect(onFocus).toHaveBeenCalled();
  });

  it('closes on Escape', () => {
    render(<Basic />);
    fireEvent.focus(box());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
  });

  it('closes on a click outside', () => {
    render(<Basic />);
    fireEvent.focus(box());
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
  });

  it('closes the moment focus leaves for something outside, but not for the panel', () => {
    render(<Basic />);
    fireEvent.focus(box());
    fireEvent.blur(box(), { relatedTarget: screen.getByRole('button', { name: 'Apple' }) });
    expect(document.querySelector('.volta-dropdown')).toHaveClass('is-open');
    fireEvent.blur(box(), { relatedTarget: screen.getByRole('button', { name: 'Elsewhere' }) });
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
    fireEvent.focus(box());
    fireEvent.blur(box(), { relatedTarget: null });
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
  });

  it('does not take focus from the textbox when the panel\'s text is pressed, but lets controls have it', () => {
    render(<Basic />);
    fireEvent.focus(box());
    expect(fireEvent.mouseDown(screen.getByText('Some text'))).toBe(false);
    expect(fireEvent.mouseDown(screen.getByRole('button', { name: 'Apple' }))).toBe(true);
  });

  it('reports open and close with onOpenChange, and can be controlled with open', () => {
    const onOpenChange = jest.fn();
    const { rerender } = render(<Basic open={false} onOpenChange={onOpenChange} />);
    fireEvent.focus(box());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
    rerender(<Basic open onOpenChange={onOpenChange} />);
    expect(document.querySelector('.volta-dropdown')).toHaveClass('is-open');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('closes on a choice marked data-dropdown-close', () => {
    render(
      <TextboxDropdown textbox={<TextBox label="Fruit" />}>
        <button type="button" data-dropdown-close>Pick</button>
      </TextboxDropdown>
    );
    fireEvent.focus(box());
    fireEvent.click(screen.getByRole('button', { name: 'Pick' }));
    expect(document.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
  });

  it('can use a role for its panel', () => {
    render(<Basic panelRole="listbox" />);
    expect(box()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(document.querySelector('.textbox_dropdown-panel')).toHaveAttribute('role', 'listbox');
  });

  it('works with a value held by the parent', () => {
    const Parent = () => {
      const [value, setValue] = useState('');
      return (
        <TextboxDropdown textbox={<TextBox label="Fruit" value={value} onChange={(e) => setValue(e.target.value)} />}>
          <button type="button" data-dropdown-close onClick={() => setValue('Mango')}>Mango</button>
        </TextboxDropdown>
      );
    };
    render(<Parent />);
    fireEvent.focus(box());
    fireEvent.click(screen.getByRole('button', { name: 'Mango' }));
    expect(box()).toHaveValue('Mango');
  });
});
