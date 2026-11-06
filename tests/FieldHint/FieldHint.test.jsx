import { render, screen } from '@testing-library/react';

import FieldHint from '../../components/FieldHint/FieldHint';
import TextField from '../../components/TextField/TextField';

describe('FieldHint', () => {
  it('renders its text as a paragraph with the id it is given', () => {
    render(<FieldHint id="why">Use your work email</FieldHint>);
    const hint = screen.getByText('Use your work email');
    expect(hint.tagName).toBe('P');
    expect(hint).toHaveClass('volta-field_hint');
    expect(hint).toHaveAttribute('id', 'why');
  });

  it('describes a control that points at it', () => {
    render(
      <>
        <input aria-label="Email" aria-describedby="why" />
        <FieldHint id="why">Use your work email</FieldHint>
      </>
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Use your work email');
  });

  it('works without an id', () => {
    render(<FieldHint>Plain</FieldHint>);
    expect(screen.getByText('Plain')).not.toHaveAttribute('id');
  });
});

describe('TextField hint and error', () => {
  it('links its label, hint and error to the input', () => {
    render(<TextField label="Email" hint="Use your work address" error="Not an email address" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleName('Email');
    expect(input).toHaveAccessibleDescription('Use your work address Not an email address');
    expect(input).toBeInvalid();
  });

  it('shows a hint on its own, without a label', () => {
    render(<TextField aria-label="Email" hint="Use your work address" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Use your work address');
    expect(screen.getByRole('textbox')).not.toBeInvalid();
  });

  it('shows a hint under the field, before the error', () => {
    const { container } = render(<TextField label="Email" hint="Hint" error="Error" />);
    const text = container.textContent;
    expect(text.indexOf('Hint')).toBeGreaterThan(text.indexOf('Email'));
    expect(text.indexOf('Error')).toBeGreaterThan(text.indexOf('Hint'));
  });

  it('keeps a description the caller gave it', () => {
    render(<TextField aria-label="Email" hint="Hint" aria-describedby="elsewhere" />);
    const ids = screen.getByRole('textbox').getAttribute('aria-describedby').split(' ');
    expect(ids).toContain('elsewhere');
    expect(ids).toHaveLength(2);
  });

  it('is still a bare field without a label, hint or error', () => {
    const { container } = render(<TextField aria-label="Email" />);
    expect(container.firstChild).toHaveClass('volta-textfield');
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('puts the hint on a multiline field too', () => {
    render(<TextField multiline label="Bio" hint="Two sentences" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Bio');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Two sentences');
  });
});
