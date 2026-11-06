import { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import useFocusTrap from '../../components/Overlay/useFocusTrap';

const Trap = ({ active = true, label = 'trap', children }) => {
  const ref = useRef(null);
  useFocusTrap(ref, active);
  return <div ref={ref} data-testid={label}>{children}</div>;
};

const tab = (options = {}) => {
  const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, ...options });
  document.activeElement.dispatchEvent(event);
  return event;
};

const buttons = (...names) => names.map((name) => <button key={name} type="button">{name}</button>);

describe('useFocusTrap', () => {
  it('moves focus to the first focusable element when it opens', () => {
    render(<Trap>{buttons('One', 'Two')}</Trap>);
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
  });

  it('leaves focus where it is if something inside already has it', () => {
    render(<Trap><button type="button">One</button><button type="button" autoFocus>Two</button></Trap>);
    expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
  });

  it('focuses the container when nothing inside can take focus', () => {
    render(<Trap><p>Just text</p></Trap>);
    expect(screen.getByTestId('trap')).toHaveFocus();
  });

  it('skips disabled, hidden and tabindex=-1 elements', () => {
    render(
      <Trap>
        <button type="button" disabled>Disabled</button>
        <button type="button" hidden>Hidden</button>
        <button type="button" tabIndex={-1}>Skipped</button>
        <button type="button">Real</button>
      </Trap>
    );
    expect(screen.getByRole('button', { name: 'Real' })).toHaveFocus();
  });

  it('wraps Tab from the last element to the first, and Shift+Tab the other way', () => {
    render(<Trap>{buttons('One', 'Two', 'Three')}</Trap>);
    screen.getByRole('button', { name: 'Three' }).focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();

    expect(tab({ shiftKey: true }).defaultPrevented).toBe(true);
    expect(screen.getByRole('button', { name: 'Three' })).toHaveFocus();
  });

  it('lets Tab move normally between elements in the middle', () => {
    render(<Trap>{buttons('One', 'Two', 'Three')}</Trap>);
    screen.getByRole('button', { name: 'Two' }).focus();
    expect(tab().defaultPrevented).toBe(false);
    expect(tab({ shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('pulls focus back in if it got outside', () => {
    render(<><button type="button">Outside</button><Trap>{buttons('One', 'Two')}</Trap></>);
    screen.getByRole('button', { name: 'Outside' }).focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
  });

  it('keeps Tab inside when there is only the container to focus', () => {
    render(<Trap><p>Just text</p></Trap>);
    expect(tab().defaultPrevented).toBe(true);
    expect(screen.getByTestId('trap')).toHaveFocus();
  });

  it('ignores other keys', () => {
    render(<Trap>{buttons('One', 'Two')}</Trap>);
    screen.getByRole('button', { name: 'Two' }).focus();
    const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
    document.activeElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  describe('closing', () => {
    it('gives focus back to what had it before', () => {
      const { rerender } = render(<><button type="button">Opener</button><Trap active={false}>{buttons('One')}</Trap></>);
      screen.getByRole('button', { name: 'Opener' }).focus();
      rerender(<><button type="button">Opener</button><Trap active>{buttons('One')}</Trap></>);
      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
      rerender(<><button type="button">Opener</button><Trap active={false}>{buttons('One')}</Trap></>);
      expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
    });

    it('gives focus back when it unmounts', () => {
      const { rerender } = render(<button type="button">Opener</button>);
      screen.getByRole('button', { name: 'Opener' }).focus();
      rerender(<><button type="button">Opener</button><Trap>{buttons('One')}</Trap></>);
      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
      rerender(<button type="button">Opener</button>);
      expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
    });

    it('does not steal focus the user has already moved elsewhere', () => {
      const { rerender } = render(<><button type="button">Opener</button><button type="button">Other</button><Trap active>{buttons('One')}</Trap></>);
      screen.getByRole('button', { name: 'Other' }).focus();
      rerender(<><button type="button">Opener</button><button type="button">Other</button><Trap active={false}>{buttons('One')}</Trap></>);
      expect(screen.getByRole('button', { name: 'Other' })).toHaveFocus();
    });

    it('does not try to focus an element that has left the page', () => {
      const { rerender } = render(<><button type="button">Opener</button><Trap active={false}>{buttons('One')}</Trap></>);
      const opener = screen.getByRole('button', { name: 'Opener' });
      opener.focus();
      rerender(<><button type="button">Opener</button><Trap active>{buttons('One')}</Trap></>);
      const focus = jest.spyOn(opener, 'focus');
      rerender(<Trap active={false}>{buttons('One')}</Trap>); // the opener is gone
      expect(opener.isConnected).toBe(false);
      expect(focus).not.toHaveBeenCalled();
    });
  });

  describe('with two traps open', () => {
    const Both = ({ inner = true }) => (
      <>
        <button type="button">Opener</button>
        <Trap label="outer">{buttons('Outer one', 'Outer two')}</Trap>
        {inner && <Trap label="inner">{buttons('Inner one', 'Inner two')}</Trap>}
      </>
    );

    it('only the top one handles Tab', () => {
      render(<Both />);
      expect(screen.getByRole('button', { name: 'Inner one' })).toHaveFocus();
      screen.getByRole('button', { name: 'Inner two' }).focus();
      tab();
      expect(screen.getByRole('button', { name: 'Inner one' })).toHaveFocus();
    });

    it('hands back to the one underneath when the top one closes', () => {
      const { rerender } = render(<Both />);
      rerender(<Both inner={false} />);
      // Focus returns to where it was in the outer trap, and the outer trap works again
      expect(screen.getByRole('button', { name: 'Outer one' })).toHaveFocus();
      screen.getByRole('button', { name: 'Outer two' }).focus();
      expect(tab().defaultPrevented).toBe(true);
      expect(screen.getByRole('button', { name: 'Outer one' })).toHaveFocus();
    });
  });
});
