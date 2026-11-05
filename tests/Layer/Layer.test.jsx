import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Layer from '../../components/Layer/Layer';

const layers = () => document.querySelectorAll('.volta-layer');

describe('Layer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Layer />);
    expect(container).toBeInTheDocument();
  });

  it('renders its children into a node on the body, not in place', () => {
    const { container } = render(<Layer><span>In the layer</span></Layer>);
    expect(container).toBeEmptyDOMElement();
    const text = screen.getByText('In the layer');
    expect(text.closest('.volta-layer')).not.toBeNull();
    expect(text.closest('.volta-layer').parentNode).toBe(document.body);
  });

  it('keeps an empty layer when there are no children', () => {
    render(<Layer />);
    expect(layers()).toHaveLength(1);
    expect(layers()[0]).toBeEmptyDOMElement();
  });

  it('removes its node from the body when unmounted', () => {
    const { unmount } = render(<Layer>Gone soon</Layer>);
    expect(layers()).toHaveLength(1);
    unmount();
    expect(layers()).toHaveLength(0);
    expect(screen.queryByText('Gone soon')).not.toBeInTheDocument();
  });

  it('stacks layers in the order they mount', () => {
    const Stack = () => {
      const [second, setSecond] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setSecond(true)}>Add</button>
          <Layer><span>first</span></Layer>
          {second && <Layer><span>second</span></Layer>}
        </>
      );
    };
    render(<Stack />);
    fireEvent.click(screen.getByText('Add'));
    const order = Array.from(layers()).map((layer) => layer.textContent);
    expect(order).toEqual(['first', 'second']);
  });

  it('lets clicks inside the layer bubble to the component that rendered it', () => {
    const onClick = jest.fn();
    render(<div onClick={onClick}><Layer><button type="button">Inside</button></Layer></div>);
    fireEvent.click(screen.getByText('Inside'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps those clicks from the parent when the handler stops propagation', () => {
    const onClick = jest.fn();
    render(
      <div onClick={onClick}>
        <Layer><button type="button" onClick={(e) => e.stopPropagation()}>Inside</button></Layer>
      </div>
    );
    fireEvent.click(screen.getByText('Inside'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
