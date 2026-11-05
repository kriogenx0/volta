import { render, screen } from '@testing-library/react';

import PageWidth from '../../components/PageWidth/PageWidth';

describe('PageWidth', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageWidth />);
    expect(container).toBeInTheDocument();
  });

  it('wraps its children in the page width classes', () => {
    render(<PageWidth><p>Content</p></PageWidth>);
    const wrapper = screen.getByText('Content').parentElement;
    expect(wrapper).toHaveClass('volta-page_width', 'c-page_width');
  });

  it('adds a custom class name', () => {
    render(<PageWidth className="view-reports"><p>Content</p></PageWidth>);
    expect(screen.getByText('Content').parentElement).toHaveClass('volta-page_width', 'view-reports');
  });
});
