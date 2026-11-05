import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent } from '@testing-library/react';

import TableListRow from '../../components/TableList/TableListRow';

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('TableListRow with the automatic JSX runtime', () => {
  const renderRow = (props) => render(
    jsx('table', { children: jsx('tbody', { children: jsx(TableListRow, { fields: [], record: { get: () => 1 }, ...props }) }) })
  );

  it('shows the checkbox by default and tolerates a missing onCheckboxChange', () => {
    renderRow({});
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(() => fireEvent.click(checkbox)).not.toThrow();
  });

  it('hides the checkbox when showCheckbox is false', () => {
    renderRow({ showCheckbox: false });
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
