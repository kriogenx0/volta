import { render, screen, fireEvent } from '@testing-library/react';

import FieldLabel from '../../components/FieldLabel/FieldLabel';

describe('FieldLabel', () => {
  it('labels the control it points at', () => {
    render(<><FieldLabel htmlFor="name">Name</FieldLabel><input id="name" /></>);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('marks optional fields', () => {
    render(<FieldLabel htmlFor="name" optional>Name</FieldLabel>);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('omits the optional marker by default', () => {
    render(<FieldLabel htmlFor="name">Name</FieldLabel>);
    expect(screen.queryByText('(optional)')).toBeNull();
  });
});

describe('FieldLabel markup', () => {
  it('renders a <label> carrying the volta-field_label class', () => {
    render(<FieldLabel htmlFor="name">Name</FieldLabel>);
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('volta-field_label');
    expect(label).toHaveAttribute('for', 'name');
  });

  it('activates the control it points at when the label is clicked', () => {
    render(<><FieldLabel htmlFor="agree">I agree</FieldLabel><input id="agree" type="checkbox" /></>);
    const checkbox = screen.getByLabelText('I agree');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(screen.getByText('I agree'));
    expect(checkbox).toBeChecked();
  });

  it('renders formatted children', () => {
    render(<FieldLabel htmlFor="billing">Billing <strong>address</strong></FieldLabel>);
    expect(screen.getByText('address').tagName).toBe('STRONG');
  });

  it('keeps the optional marker inside the label so it is part of the accessible name', () => {
    render(<><FieldLabel htmlFor="name" optional>Name</FieldLabel><input id="name" /></>);
    expect(screen.getByLabelText(/Name\s+\(optional\)/)).toBeInTheDocument();
  });

  it('styles the optional marker separately from the label text', () => {
    render(<FieldLabel htmlFor="name" optional>Name</FieldLabel>);
    expect(screen.getByText('(optional)')).toHaveClass('volta-field_label-optional');
  });

  it('renders without a control to point at', () => {
    render(<FieldLabel>Notes</FieldLabel>);
    expect(screen.getByText('Notes')).not.toHaveAttribute('for');
  });
});
