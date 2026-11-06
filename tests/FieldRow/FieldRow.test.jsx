import { render, screen } from '@testing-library/react';

import FieldRow from '../../components/FieldRow/FieldRow';
import Select from '../../components/Select/Select';
import TextField from '../../components/TextField/TextField';

describe('FieldRow', () => {
  it('renders without crashing', () => {
    const { container } = render(<FieldRow />);
    expect(container).toBeInTheDocument();
  });

  it('shows the label and the control side by side', () => {
    const { container } = render(<FieldRow label="Name"><TextField /></FieldRow>);
    expect(container.firstChild).toHaveClass('volta-field_row');
    expect(container.querySelector('.field_row-label')).toHaveTextContent('Name');
    expect(container.querySelector('.field_row-body')).toContainElement(screen.getByRole('textbox'));
  });

  it('can be centred', () => {
    const { container } = render(<FieldRow label="Name" centered><TextField /></FieldRow>);
    expect(container.firstChild).toHaveClass('field_row-centered');
  });

  it('has a real <label> that names the one control', () => {
    render(<FieldRow label="Name"><TextField /></FieldRow>);
    expect(screen.getByText('Name').tagName).toBe('LABEL');
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Name');
  });

  it('names a Select, and a control with its own id', () => {
    render(
      <>
        <FieldRow label="Role"><Select options={[]} /></FieldRow>
        <FieldRow label="Native"><input id="plain" /></FieldRow>
      </>
    );
    expect(screen.getByRole('combobox')).toHaveAccessibleName('Role');
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Native');
  });

  it('describes the control by its hint and error, and marks it invalid', () => {
    render(<FieldRow label="Email" hint="Use your work address" error="Not an email address"><TextField /></FieldRow>);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('Use your work address Not an email address');
    expect(input).toBeInvalid();
  });

  it('names a group when there are several controls', () => {
    render(
      <FieldRow label="Date of birth" hint="As on your passport">
        <TextField aria-label="Day" />
        <TextField aria-label="Month" />
      </FieldRow>
    );
    const group = screen.getByRole('group', { name: 'Date of birth' });
    expect(group).toHaveAccessibleDescription('As on your passport');
    expect(screen.getByText('Date of birth')).not.toHaveAttribute('for');
  });
});
