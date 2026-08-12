import { render } from '@testing-library/react';

import Calendar from '../../components/Calendar/Calendar';

describe('Calendar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Calendar />);
    expect(container).toBeInTheDocument();
  });
});
