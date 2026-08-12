import { render } from '@testing-library/react';

import Textarea from '../../components/Textarea/Textarea';

describe('Textarea', () => {
  it('renders without crashing', () => {
    const { container } = render(<Textarea />);
    expect(container).toBeInTheDocument();
  });
});
