import { render, screen } from '@testing-library/react';

import TextField, { TextBox } from '../../components/TextField/TextField';
import * as barrel from '../../components';

describe('TextField', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextField />);
    expect(container).toBeInTheDocument();
  });

  it('labels the input and marks optional fields', () => {
    render(<TextField label="Name" optional />);
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('defaults to the small size and accepts the medium one', () => {
    const { container, rerender } = render(<TextField />);
    expect(container.firstChild).toHaveClass('volta-textfield--sm');
    rerender(<TextField fieldSize="md" />);
    expect(container.firstChild).toHaveClass('volta-textfield--md');
  });

  it('renders a textarea when multiline and passes className to the control', () => {
    render(<TextField multiline className="custom" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  describe('TextBox alias', () => {
    it('renders a TextField with the c-text_box compat class', () => {
      const { container } = render(<TextBox placeholder="Same" />);
      expect(container.querySelector('.c-text_box')).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('volta-textfield', 'volta-textfield--sm');
      expect(screen.getByPlaceholderText('Same')).toBeInTheDocument();
    });

    it('accepts every TextField prop, including its own wrapperClassName', () => {
      const { container } = render(<TextBox label="Name" fieldSize="md" wrapperClassName="mine" />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(container.querySelector('.volta-textfield--md')).toBeInTheDocument();
      expect(container.querySelector('.mine')).toBeInTheDocument();
    });

    it('is still exported from the library entry point', () => {
      expect(barrel.TextBox).toBe(TextBox);
      expect(barrel.TextField).toBe(TextField);
    });
  });
});
