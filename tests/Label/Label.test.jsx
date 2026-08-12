import { render } from '@testing-library/react';

import Label from '../../components/Label/Label';

describe('Label', () => {
  it('renders without crashing', () => {
    const { container } = render(<Label />);
    expect(container).toBeInTheDocument();
  });
});
