import { render } from '@testing-library/react';

import TagInput from '../../components/TagInput/TagInput';

describe('TagInput', () => {
  it('renders without crashing', () => {
    const { container } = render(<TagInput />);
    expect(container).toBeInTheDocument();
  });
});
