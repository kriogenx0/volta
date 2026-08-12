import { render } from '@testing-library/react';

import TextEditable from '../../components/TextEditable/TextEditable';

describe('TextEditable', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextEditable />);
    expect(container).toBeInTheDocument();
  });
});
