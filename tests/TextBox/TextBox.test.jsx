import { render } from '@testing-library/react';

import TextBox from '../../components/TextBox';

describe('TextBox', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextBox />);
    expect(container).toBeInTheDocument();
  });

  it('applies the c-text_box compat class', () => {
    const { container } = render(<TextBox />);
    expect(container.querySelector('.c-text_box')).toBeInTheDocument();
  });
});
