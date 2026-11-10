import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';

import Drawer from '../../components/Drawer/Drawer';

describe('Drawer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Drawer />);
    expect(container).toBeInTheDocument();
  });

  it('renders its children in a labelled dialog panel', () => {
    render(<Drawer open label="Order details">Panel text</Drawer>);
    const panel = screen.getByRole('dialog', { name: 'Order details' });
    expect(panel).toHaveTextContent('Panel text');
    expect(panel).toHaveClass('drawer-contents');
  });

  it('is only marked open when open is set', () => {
    const { container, rerender } = render(<Drawer>Panel</Drawer>);
    expect(container.firstChild).not.toHaveClass('drawer-open');
    rerender(<Drawer open>Panel</Drawer>);
    expect(container.firstChild).toHaveClass('drawer-open');
  });

  it('adds a custom className to the root', () => {
    const { container } = render(<Drawer className="my-drawer" />);
    expect(container.firstChild).toHaveClass('volta-drawer', 'my-drawer');
  });

  it('is 50% wide unless a width is given', () => {
    const { container, rerender } = render(<Drawer />);
    expect(container.querySelector('.drawer-contents')).toHaveStyle({ width: '50%' });
    rerender(<Drawer width="320px" />);
    expect(container.querySelector('.drawer-contents')).toHaveStyle({ width: '320px' });
  });

  it('applies its defaults under the automatic JSX runtime used by the Vite build', () => {
    // defaultProps are ignored on function components by that runtime
    const { container } = render(jsx(Drawer, {}));
    expect(container.querySelector('.drawer-contents')).toHaveStyle({ width: '50%' });
  });

  it('calls onClose when the scrim is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<Drawer open onClose={onClose} />);
    fireEvent.click(container.querySelector('.drawer-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the panel itself is clicked', () => {
    const onClose = jest.fn();
    render(<Drawer open onClose={onClose}>Panel text</Drawer>);
    fireEvent.click(screen.getByText('Panel text'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape while open, and not while closed', () => {
    const onClose = jest.fn();
    const { rerender } = render(<Drawer onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    rerender(<Drawer open onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops listening for Escape once unmounted', () => {
    const onClose = jest.fn();
    const { unmount } = render(<Drawer open onClose={onClose} />);
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not throw when the scrim or Escape is used without an onClose', () => {
    const { container } = render(<Drawer open />);
    expect(() => {
      fireEvent.click(container.querySelector('.drawer-overlay'));
      fireEvent.keyDown(document, { key: 'Escape' });
    }).not.toThrow();
  });
});

describe('Drawer edges', () => {
  const panel = (container) => container.querySelector('.drawer-contents');

  it('comes in from the trailing (right) edge by default', () => {
    const { container } = render(<Drawer open>Panel</Drawer>);
    expect(container.firstChild).toHaveClass('drawer-edge-trailing');
    expect(panel(container)).toHaveStyle({ width: '50%' });
  });

  it.each(['leading', 'trailing'])('a %s drawer is as wide as asked and has no height of its own', (edge) => {
    const { container } = render(<Drawer open edge={edge} width="320px" height="10%">Panel</Drawer>);
    expect(container.firstChild).toHaveClass(`drawer-edge-${edge}`);
    expect(panel(container)).toHaveStyle({ width: '320px' });
    expect(panel(container).style.height).toBe('');
  });

  it.each(['top', 'bottom'])('a %s drawer is as tall as asked and has no width of its own', (edge) => {
    const { container } = render(<Drawer open edge={edge} height="60%" width="10px">Panel</Drawer>);
    expect(container.firstChild).toHaveClass(`drawer-edge-${edge}`);
    expect(panel(container)).toHaveStyle({ height: '60%' });
    expect(panel(container).style.width).toBe('');
  });

  it('is 50% tall by default at the bottom', () => {
    const { container } = render(<Drawer open edge="bottom">Panel</Drawer>);
    expect(panel(container)).toHaveStyle({ height: '50%' });
  });

  it('lists the edges SwiftUI names', () => {
    expect(Drawer.edges).toEqual(['leading', 'trailing', 'top', 'bottom']);
  });

  it('closes on Escape and on the scrim from any edge', () => {
    const onClose = jest.fn();
    const { container } = render(<Drawer open edge="bottom" onClose={onClose}>Panel</Drawer>);
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(container.querySelector('.drawer-overlay'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('slides each edge from off-canvas to 0 with the global speed', () => {
    const scss = fs.readFileSync(path.join(__dirname, '../../components/Drawer/Drawer.scss'), 'utf8');
    ['right', 'left', 'bottom', 'top'].forEach((side) => {
      expect(scss).toMatch(new RegExp(`${side}: -100%;`));
      expect(scss).toMatch(new RegExp(`transition: ${side} var\\(--v-anim-speed\\) var\\(--v-anim-ease\\);`));
    });
  });
});
