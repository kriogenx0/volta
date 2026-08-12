import { render } from '@testing-library/react';

import RichTextQuill from '../../components/RichTextQuill/RichTextQuill';

describe('RichTextQuill', () => {
  it('renders without crashing', () => {
    const { container } = render(<RichTextQuill />);
    expect(container).toBeInTheDocument();
  });
});
