import { render } from '@testing-library/react';

import TextBox from '../../components/TextBox';

describe('TextBox', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextBox />);
    expect(container).toBeInTheDocument();
  });
});
