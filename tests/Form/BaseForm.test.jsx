import { render } from '@testing-library/react';

import { BaseForm, BaseInput, FormRow } from '../../components/Form';

describe('BaseForm', () => {
  it('renders without crashing', () => {
    const { container } = render(<BaseForm />);
    expect(container).toBeInTheDocument();
  });
});
