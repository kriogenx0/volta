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

  describe('initials', () => {
    it('uses at most the first two words, upper-cased', () => {
      render(<Avatar name="grace brewster murray hopper" />);
      expect(screen.getByText('GB')).toBeInTheDocument();
    });

    it('uses one initial for a single word', () => {
      render(<Avatar name="Plato" />);
      expect(screen.getByText('P')).toBeInTheDocument();
    });

    it('ignores extra spaces around the words', () => {
      render(<Avatar name="  ada   lovelace " />);
      expect(screen.getByText('AL')).toBeInTheDocument();
    });

    it('keeps a whole character, not half of a surrogate pair', () => {
      render(<Avatar name={'\u{1F600} Smile'} />);
      expect(screen.getByText('\u{1F600}S')).toBeInTheDocument();
    });
  });

  describe('without a name', () => {
    it('renders an empty circle instead of throwing', () => {
      const { container } = render(<Avatar />);
      const circle = container.querySelector('.volta-avatar--initials');
      expect(circle).toBeInTheDocument();
      expect(circle).toBeEmptyDOMElement();
      expect(circle).not.toHaveAttribute('aria-label');
    });

    it('renders no initials for a blank name', () => {
      const { container } = render(<Avatar name="   " />);
      expect(container.querySelector('.volta-avatar--initials')).toBeEmptyDOMElement();
    });

    it('still shows a photo', () => {
      const { container } = render(<Avatar photoUrl="/ada.png" />);
      expect(container.querySelector('img')).toHaveAttribute('alt', '');
    });
  });

  describe('accessible name', () => {
    it('names the initials after the person', () => {
      render(<Avatar name="Ada Lovelace" />);
      expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
    });

    it('names the photo after the person', () => {
      render(<Avatar name="Ada Lovelace" photoUrl="/ada.png" />);
      expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('src', '/ada.png');
    });
  });

  it('defaults to the medium size', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    expect(container.firstChild).toHaveClass('volta-avatar--md');
  });
});
