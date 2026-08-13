import { render } from '@testing-library/react';

import TextBox from '../../components/TextBox';
import TextField from '../../components/TextField/TextField';

describe('TextBox', () => {
  it('is a compatibility alias of TextField', () => {
    expect(TextBox).toBe(TextField);
  });

  it('renders without crashing', () => {
    const { container } = render(<TextBox />);
    expect(container).toBeInTheDocument();
  });
});
