import { render } from '@testing-library/react';

import ComboBox from '../../components/ComboBox/ComboBox';

describe('ComboBox', () => {
  it('renders without crashing', () => {
    const { container } = render(<ComboBox />);
    expect(container).toBeInTheDocument();
  });
});
