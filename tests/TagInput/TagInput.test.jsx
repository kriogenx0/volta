import { fireEvent, render, screen } from '@testing-library/react';

import TagInput from '../../components/TagInput/TagInput';

const press = (input, key) => fireEvent.keyPress(input, { key, code: key, charCode: key === 'Enter' ? 13 : key.charCodeAt(0) });

describe('TagInput', () => {
  it('renders without crashing', () => {
    const { container } = render(<TagInput />);
    expect(container).toBeInTheDocument();
  });

  it('does not show a remove button on tags by default', () => {
    const { container } = render(<TagInput tags={['Design', 'React']} />);
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.querySelector('.deletable')).toBeNull();
  });

  it('renders an accessible remove button for each tag when removable', () => {
    const onChange = jest.fn();
    render(<TagInput removable tags={['Design', 'React']} onChange={onChange} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Design' }));

    expect(onChange).toHaveBeenCalledWith(['React']);
    expect(screen.queryByText('Design')).not.toBeInTheDocument();
  });

  it('does not pass removable on to the text input', () => {
    render(<TagInput removable />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('removable');
  });

  it('adds a tag when Enter is pressed', () => {
    const onChange = jest.fn();
    render(<TagInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New' } });
    press(input, 'Enter');
    expect(onChange).toHaveBeenCalledWith(['New']);
    expect(screen.getByText('New')).toBeInTheDocument();
  });
});

describe('TagInput remove buttons', () => {
  it('draw the X with the xmark icon', () => {
    const { container } = render(<TagInput tags={['a', 'b']} removable />);
    const icons = container.querySelectorAll('.tag_input-remove .volta-icon');
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute('data-type', 'xmark');
      expect(icon).toHaveClass('icon-svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
