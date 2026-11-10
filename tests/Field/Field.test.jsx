import { render, screen } from '@testing-library/react';

import Field from '../../components/Field/Field';
import Checkbox from '../../components/Checkbox/Checkbox';
import Select from '../../components/Select/Select';
import TextField from '../../components/TextBox/TextBox';
import Toggle from '../../components/Toggle/Toggle';

describe('Field', () => {
  it('renders without crashing', () => {
    const { container } = render(<Field />);
    expect(container).toBeInTheDocument();
  });

  it('shows its children, with or without a label', () => {
    const { rerender } = render(<Field><span>Just this</span></Field>);
    expect(screen.getByText('Just this')).toBeInTheDocument();
    rerender(<Field label="Name"><span>Just this</span></Field>);
    expect(screen.getByText('Just this')).toBeInTheDocument();
  });

  describe('the label', () => {
    it('is a real <label> that names the one control inside, so a screen reader reads it', () => {
      render(<Field label="Name"><TextField /></Field>);
      expect(screen.getByLabelText('Name')).toBe(screen.getByRole('textbox'));
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Name');
    });

    it('names a Select, and a multiline TextField', () => {
      render(
        <>
          <Field label="Role"><Select options={[{ value: 'a', label: 'Admin' }]} /></Field>
          <Field label="Bio"><TextField multiline /></Field>
        </>
      );
      expect(screen.getByRole('combobox')).toHaveAccessibleName('Role');
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Bio');
    });

    it('points at the control, so clicking it focuses the control in a browser', () => {
      render(<Field label="Name"><TextField /></Field>);
      expect(screen.getByText('Name').control).toBe(screen.getByRole('textbox'));
    });

    it('points at the control\'s own id when it has one', () => {
      render(<Field label="Name"><TextField id="mine" /></Field>);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'mine');
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Name');
    });

    it('names a native input given an id, with no htmlFor', () => {
      render(<Field label="Native"><input id="plain" /></Field>);
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Native');
    });

    it('can point at a control it did not make, by htmlFor', () => {
      render(<Field label="Native" htmlFor="native"><input id="native" /></Field>);
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Native');
    });

    it('gives two Fields on a page two different ids', () => {
      render(<><Field label="One"><TextField /></Field><Field label="Two"><TextField /></Field></>);
      const [one, two] = screen.getAllByRole('textbox');
      expect(one.id).not.toBe(two.id);
      expect(one).toHaveAccessibleName('One');
      expect(two).toHaveAccessibleName('Two');
    });
  });

  describe('a hint', () => {
    it('is read as the description of the control', () => {
      render(<Field label="Email" hint="Use your work address"><TextField /></Field>);
      expect(screen.getByText('Use your work address')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Use your work address');
    });

    it('keeps a description the control already had', () => {
      render(<Field label="Email" hint="Use your work address"><TextField aria-describedby="elsewhere" /></Field>);
      expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toContain('elsewhere');
      expect(screen.getByRole('textbox').getAttribute('aria-describedby').split(' ')).toHaveLength(2);
    });
  });

  describe('an error', () => {
    it('shows the message, marks the control invalid and describes it', () => {
      render(<Field label="Email" error="Not an email address"><TextField /></Field>);
      const input = screen.getByRole('textbox');
      expect(screen.getByText('Not an email address')).toBeInTheDocument();
      expect(input).toBeInvalid();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Not an email address');
    });

    it('describes the control by the hint and the error, in that order', () => {
      render(<Field label="Email" hint="Use your work address" error="Not an email address"><TextField /></Field>);
      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Use your work address Not an email address');
    });

    it('marks a Select invalid too', () => {
      render(<Field label="Role" error="Pick one"><Select options={[]} /></Field>);
      expect(screen.getByRole('combobox')).toBeInvalid();
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Pick one');
    });

    it('leaves the control valid when there is no error', () => {
      render(<Field label="Email" hint="Use your work address"><TextField /></Field>);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('also shows when there is no label', () => {
      render(<Field error="Required"><TextField aria-label="Name" /></Field>);
      expect(screen.getByRole('textbox')).toBeInvalid();
      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Required');
    });
  });

  describe('with several controls', () => {
    const renderGroup = () => render(
      <Field label="Date of birth" hint="As on your passport">
        <TextField aria-label="Day" />
        <TextField aria-label="Month" />
      </Field>
    );

    it('names the group by the label, and describes it by the hint', () => {
      renderGroup();
      const group = screen.getByRole('group', { name: 'Date of birth' });
      expect(group).toHaveAccessibleDescription('As on your passport');
    });

    it('does not give the controls one shared id', () => {
      renderGroup();
      const ids = screen.getAllByRole('textbox').map((input) => input.id).filter(Boolean);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('leaves each control with its own name', () => {
      renderGroup();
      expect(screen.getByRole('textbox', { name: 'Day' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Month' })).toBeInTheDocument();
    });

    it('does not make the label point at anything', () => {
      renderGroup();
      expect(screen.getByText('Date of birth')).not.toHaveAttribute('for');
    });
  });

  it('does not leak its ids into a control outside it', () => {
    render(<><Field label="Inside" hint="A hint"><TextField /></Field><TextField aria-label="Outside" /></>);
    const outside = screen.getByRole('textbox', { name: 'Outside' });
    expect(outside).not.toHaveAttribute('aria-describedby');
    expect(outside).not.toHaveAttribute('aria-invalid');
  });

  describe('with a Toggle or a Checkbox', () => {
    it('names a Toggle, which has no text of its own', () => {
      render(<Field label="Email notifications" type="split"><Toggle checked onChange={() => {}} /></Field>);
      expect(screen.getByRole('checkbox')).toHaveAccessibleName('Email notifications');
    });

    it('describes a Toggle by the hint and marks it invalid for an error', () => {
      render(<Field label="Alerts" hint="Sent by email" error="Turn this on to continue"><Toggle checked={false} onChange={() => {}} /></Field>);
      expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Sent by email Turn this on to continue');
      expect(screen.getByRole('checkbox')).toBeInvalid();
    });

    it('adds the Field\'s label to a Checkbox\'s own', () => {
      render(<Field label="Updates"><Checkbox label="Send me product updates" onChange={() => {}} checked={false} /></Field>);
      expect(screen.getByRole('checkbox')).toHaveAccessibleName('Updates Send me product updates');
    });

    it('leaves a Toggle and a Checkbox alone outside a Field', () => {
      render(<><Toggle aria-label="Plain" checked onChange={() => {}} /><Checkbox label="Alone" checked onChange={() => {}} /></>);
      expect(screen.getByRole('checkbox', { name: 'Plain' })).not.toHaveAttribute('aria-describedby');
      expect(screen.getByRole('checkbox', { name: 'Alone' })).not.toHaveAttribute('aria-invalid');
    });
  });

  it('keeps its layout classes', () => {
    const { container } = render(<Field label="Name" type="split" stack className="extra"><TextField /></Field>);
    expect(container.firstChild).toHaveClass('volta-field', 'c-field', 'field-split', 'field-stack', 'extra');
    expect(container.querySelector('.field-label')).toBeInTheDocument();
    expect(container.querySelector('.field-child')).toBeInTheDocument();
  });
});
