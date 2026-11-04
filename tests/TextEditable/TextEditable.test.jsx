import { render, fireEvent } from '@testing-library/react';

import TextEditable from '../../components/TextEditable/TextEditable';

describe('TextEditable', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextEditable />);
    expect(container).toBeInTheDocument();
  });

  it('passes the event to onChange, onBlur and onFinish', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const onFinish = jest.fn();
    const { container } = render(
      <TextEditable onChange={onChange} onBlur={onBlur} onFinish={onFinish} />,
    );
    const el = container.firstChild;

    el.innerHTML = 'edited';
    fireEvent.input(el);
    expect(onChange).toHaveBeenCalledWith('edited', expect.objectContaining({ type: 'input' }));

    fireEvent.blur(el);
    expect(onBlur).toHaveBeenCalledWith('edited', expect.objectContaining({ type: 'blur' }));
    expect(onFinish).toHaveBeenCalledWith('edited', expect.objectContaining({ type: 'blur' }));
  });
});
