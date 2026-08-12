import { render } from '@testing-library/react';

import DateFormat from '../../components/DatePicker/DateFormat';

describe('DateFormat', () => {
  it('renders without crashing', () => {
    const { container } = render(<DateFormat />);
    expect(container).toBeInTheDocument();
  });
});
