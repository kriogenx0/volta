import { render } from '@testing-library/react';

import CKEditor from '../../components/CKEditor/CKEditor';

describe('CKEditor', () => {
  it('renders without crashing', () => {
    const { container } = render(<CKEditor />);
    expect(container).toBeInTheDocument();
  });
});
