import { render, screen } from '@testing-library/react';

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
