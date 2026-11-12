import { render, screen } from '@testing-library/react';

import Avatar from '../../components/Avatar/Avatar';
import tinycolor from 'tinycolor2';
import { avatarColors, colorFromName, nameHue, normalizeName, readableOn } from '../../components/Avatar/avatarColor';

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

describe('Avatar colour', () => {
  const style = (container) => container.firstChild.style;

  it('takes a colour from the name by default', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    expect(style(container).getPropertyValue('--volta-avatar-background')).toBe(colorFromName('Ada Lovelace'));
  });

  it('uses the accent with color="accent", with no inline style', () => {
    const { container } = render(<Avatar name="Ada Lovelace" color="accent" />);
    expect(container.firstChild).not.toHaveAttribute('style');
  });

  it('is the accent when there is no name to work from', () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).not.toHaveAttribute('style');
  });

  it('takes a colour from the name with color="auto"', () => {
    const { container } = render(<Avatar name="Ada Lovelace" color="auto" />);
    expect(style(container).getPropertyValue('--volta-avatar-background')).toBe(colorFromName('Ada Lovelace'));
    expect(style(container).getPropertyValue('--volta-avatar-color')).toBeTruthy();
  });

  it('gives the same name the same colour every time', () => {
    const a = render(<Avatar name="Grace Hopper" color="auto" />).container.firstChild.style.getPropertyValue('--volta-avatar-background');
    const b = render(<Avatar name="Grace Hopper" color="auto" />).container.firstChild.style.getPropertyValue('--volta-avatar-background');
    expect(a).toBe(b);
  });

  it('gives the same colour however the name is written', () => {
    const colorOf = (name) => render(<Avatar name={name} color="auto" />).container.firstChild.style.getPropertyValue('--volta-avatar-background');
    expect(colorOf('  grace   HOPPER ')).toBe(colorOf('Grace Hopper'));
    expect(colorOf('José Núñez')).toBe(colorOf('jose nunez'));
  });

  it('falls back to the accent when auto has no name to work from', () => {
    const { container } = render(<Avatar color="auto" />);
    expect(container.firstChild).not.toHaveAttribute('style');
  });

  it('uses any CSS colour it is given, with a readable text colour', () => {
    const { container } = render(<Avatar name="Ada Lovelace" color="#f0d860" />);
    expect(style(container).getPropertyValue('--volta-avatar-background')).toBe('#f0d860');
    expect(style(container).getPropertyValue('--volta-avatar-color')).toBe('#0a0a0a');
  });

  it('ignores a colour that is not one', () => {
    const { container } = render(<Avatar name="Ada" color="not-a-colour" />);
    expect(container.firstChild).not.toHaveAttribute('style');
  });

  it('leaves a photo alone', () => {
    const { container } = render(<Avatar name="Ada" photoUrl="/a.png" color="auto" />);
    expect(container.firstChild.tagName).toBe('IMG');
    expect(container.firstChild).not.toHaveAttribute('style');
  });
});

describe('avatarColor', () => {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus', 'Margaret Hamilton', '山田 太郎', 'Zoë', 'A', 'x y z'];

  it('normalises a name: case, spaces and accents', () => {
    expect(normalizeName('  José   NÚÑEZ ')).toBe('jose nunez');
    expect(normalizeName(null)).toBe('');
    expect(normalizeName('   ')).toBe('');
  });

  it('is a hue from 0 to 359, the same for the same name', () => {
    names.forEach((name) => {
      const hue = nameHue(name);
      expect(Number.isInteger(hue)).toBe(true);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
      expect(nameHue(name)).toBe(hue);
    });
  });

  it('gives most different names different colours', () => {
    const colors = new Set(names.map((name) => colorFromName(name)));
    expect(colors.size).toBeGreaterThanOrEqual(names.length - 1);
  });

  it('is always dark enough for white initials (4.5:1), across many names', () => {
    for (let i = 0; i < 720; i += 1) {
      const color = colorFromName(`Person ${i}`);
      expect(tinycolor.readability('#ffffff', color)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('spreads across the colour wheel', () => {
    const hues = new Set();
    for (let i = 0; i < 400; i += 1) hues.add(Math.floor(nameHue(`Person ${i}`) / 30));
    expect(hues.size).toBeGreaterThanOrEqual(10);
  });

  it('has no colour for a blank name', () => {
    expect(colorFromName('')).toBeNull();
    expect(colorFromName(undefined)).toBeNull();
    expect(colorFromName('   ')).toBeNull();
  });

  it('picks white or near-black text, whichever reads better', () => {
    expect(readableOn('#000000')).toBe('#ffffff');
    expect(readableOn('#ffffff')).toBe('#0a0a0a');
  });

  it('works out the colours for the three kinds of color prop', () => {
    expect(avatarColors('accent', 'Ada')).toBeNull();
    expect(avatarColors(undefined, 'Ada')).toBeNull();
    expect(avatarColors('auto', 'Ada').background).toBe(colorFromName('Ada'));
    expect(avatarColors('#336699', 'Ada').background).toBe('#336699');
    expect(avatarColors('nope', 'Ada')).toBeNull();
    expect(avatarColors('auto', '')).toBeNull();
  });
});
