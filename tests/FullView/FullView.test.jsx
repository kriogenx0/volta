import { render } from '@testing-library/react';

import FullView from '../../components/FullView/FullView';

describe('FullView', () => {
  it('renders without crashing', () => {
    const { container } = render(<FullView />);
    expect(container).toBeInTheDocument();
  });
});
