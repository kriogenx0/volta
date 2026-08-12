import { render } from '@testing-library/react';

import TextField from '../../components/TextField/TextField';

describe('TextField', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextField />);
    expect(container).toBeInTheDocument();
  });
});
