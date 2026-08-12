import { render } from '@testing-library/react';

import ModalDialog from '../../components/ModalDialog/ModalDialog';

describe('ModalDialog', () => {
  it('renders without crashing', () => {
    const { container } = render(<ModalDialog />);
    expect(container).toBeInTheDocument();
  });
});
