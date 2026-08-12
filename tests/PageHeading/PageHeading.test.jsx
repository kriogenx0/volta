import { render } from '@testing-library/react';

import PageHeading from '../../components/PageHeading/PageHeading';

describe('PageHeading', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageHeading />);
    expect(container).toBeInTheDocument();
  });
});
