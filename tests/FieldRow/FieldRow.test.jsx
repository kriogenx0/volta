import { render } from '@testing-library/react';

import FieldRow from '../../components/FieldRow/FieldRow';

describe('FieldRow', () => {
  it('renders without crashing', () => {
    const { container } = render(<FieldRow />);
    expect(container).toBeInTheDocument();
  });
});
