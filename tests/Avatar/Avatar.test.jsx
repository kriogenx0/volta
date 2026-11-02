import { render, screen } from '@testing-library/react';

import Avatar from '../../components/Avatar/Avatar';

describe('Avatar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    expect(container).toBeInTheDocument();
  });

  it('shows initials when there is no photo', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toHaveClass('volta-avatar', 'volta-avatar--md', 'volta-avatar--initials');
  });

  it('shows the photo when given one', () => {
    const { container } = render(<Avatar name="Ada Lovelace" photoUrl="/ada.png" size="sm" />);
    expect(container.querySelector('img')).toHaveClass('volta-avatar', 'volta-avatar--sm');
    expect(container.querySelector('.volta-avatar--initials')).toBeNull();
  });
});
