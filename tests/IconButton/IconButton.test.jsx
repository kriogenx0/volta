import { render } from '@testing-library/react';

import IconButton from '../../components/IconButton/IconButton';

const StubIcon = () => <svg />;

describe('IconButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<IconButton icon={StubIcon} label="Close" />);
    expect(container).toBeInTheDocument();
  });
});
