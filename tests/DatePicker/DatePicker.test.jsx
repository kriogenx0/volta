import { render } from '@testing-library/react';

import DatePicker from '../../components/DatePicker/DatePicker';

describe('DatePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<DatePicker />);
    expect(container).toBeInTheDocument();
  });
});
