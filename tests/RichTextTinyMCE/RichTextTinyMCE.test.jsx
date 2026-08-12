import { render } from '@testing-library/react';

import RichTextTinyMCE from '../../components/RichTextTinyMCE/RichTextTinyMCE';

describe('RichTextTinyMCE', () => {
  it('renders without crashing', () => {
    const { container } = render(<RichTextTinyMCE />);
    expect(container).toBeInTheDocument();
  });
});
