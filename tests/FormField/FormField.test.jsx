import { render } from '@testing-library/react';

import FormField from '../../components/FormField/FormField';

describe('FormField', () => {
  it('renders without crashing', () => {
    const { container } = render(<FormField />);
    expect(container).toBeInTheDocument();
  });
});
