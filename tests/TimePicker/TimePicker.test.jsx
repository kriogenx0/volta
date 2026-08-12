import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TimePicker from '../../components/TimePicker/TimePicker';

describe('TimePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <TimePicker />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
