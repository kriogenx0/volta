import { render, screen } from '@testing-library/react';

import { Field, FieldHint, FieldLabel, FieldRow, TextField } from '../../components';

describe('Field with FieldLabel, FieldHint and FieldRow inside', () => {
  it('points an inner FieldLabel at the one control', () => {
    render(
      <Field>
        <FieldLabel>Name</FieldLabel>
        <TextField />
      </Field>,
    );
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('describes the control by an inner FieldHint', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <TextField />
        <FieldHint>Use your work email</FieldHint>
      </Field>,
    );
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Use your work email');
  });

  it('joins an inner hint with the hint and error props', () => {
    render(
      <Field label="Email" hint="Prop hint" error="Not valid">
        <TextField />
        <FieldHint>Inner hint</FieldHint>
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('Prop hint Inner hint Not valid');
    expect(input).toBeInvalid();
  });

  it('uses the label prop for the label when both are given, without a duplicate id', () => {
    const { container } = render(
      <Field label="From prop">
        <FieldLabel>Inner</FieldLabel>
        <TextField />
      </Field>,
    );
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('names a group of FieldRows with the Field label', () => {
    render(
      <Field label="Address">
        <FieldRow label="Street"><TextField /></FieldRow>
        <FieldRow label="City"><TextField /></FieldRow>
      </Field>,
    );
    expect(screen.getByRole('group', { name: 'Address' })).toBeInTheDocument();
    expect(screen.getByLabelText('Street')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
  });

  it('treats a lone FieldRow as a group too, so the rows keep their own labels', () => {
    render(
      <Field label="Address">
        <FieldRow label="Street"><TextField /></FieldRow>
      </Field>,
    );
    expect(screen.getByRole('group', { name: 'Address' })).toBeInTheDocument();
    expect(screen.getByLabelText('Street')).toBeInTheDocument();
  });

  it('names a group with several controls by an inner FieldLabel', () => {
    render(
      <Field>
        <FieldLabel>Dates</FieldLabel>
        <TextField aria-label="From" />
        <TextField aria-label="To" />
      </Field>,
    );
    expect(screen.getByRole('group', { name: 'Dates' })).toBeInTheDocument();
  });

  it('wires parts inside a FieldRow the same way', () => {
    render(
      <FieldRow label="Phone">
        <TextField />
        <FieldHint>Digits only</FieldHint>
      </FieldRow>,
    );
    expect(screen.getByLabelText('Phone')).toHaveAccessibleDescription('Digits only');
  });
});
