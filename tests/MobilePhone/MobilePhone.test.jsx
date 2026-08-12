import { render } from '@testing-library/react';

import MobilePhone from '../../components/MobilePhone/MobilePhone';

describe('MobilePhone', () => {
  it('renders without crashing', () => {
    const { container } = render(<MobilePhone />);
    expect(container).toBeInTheDocument();
  });
});
