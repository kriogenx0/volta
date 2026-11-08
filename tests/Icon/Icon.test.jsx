import { render } from '@testing-library/react';

import Icon from '../../components/Icon/Icon';
import svgIcons from '../../components/Icon/svgIcons';

describe('Icon', () => {
  it('renders without crashing', () => {
    const { container } = render(<Icon />);
    expect(container).toBeInTheDocument();
  });
});

describe('Icon drawn as SVG', () => {
  const svgTypes = Object.keys(svgIcons);

  it('has the icons the library needs, with no icon font involved', () => {
    expect(svgTypes).toEqual(
      expect.arrayContaining(['trash', 'spinner', 'cloud-upload', 'check-circle', 'times-circle', 'arrow-up-circle'])
    );
  });

  it.each(svgTypes)('draws %s as an inline SVG in the text colour', (type) => {
    const { container } = render(<Icon type={type} />);
    const icon = container.querySelector('i');
    expect(icon).toHaveClass('volta-icon', 'icon', 'icon-svg', `icon-${type}`);
    expect(icon).toHaveAttribute('data-type', type);

    const svg = icon.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg.querySelectorAll('path').length).toBe(svgIcons[type].length);
  });

  it.each(svgTypes)('keeps the glyph of %s out of the accessibility tree and out of the tab order', (type) => {
    const { container } = render(<Icon type={type} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('draws its paths as valid path data', () => {
    // Path data is a command letter, then numbers; nothing else
    const valid = /^([MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(e-?\d+)?|[\s,])+$/;
    svgTypes.forEach((type) => {
      svgIcons[type].forEach((d) => expect(d).toMatch(valid));
    });
  });

  it('does not use the font fallbacks, so it does not warn or set a font glyph', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Icon type="trash" />);
    expect(warn).not.toHaveBeenCalled();
    expect(container.querySelector('i')).not.toHaveAttribute('style');
    expect(container.querySelector('i')).not.toHaveClass('icon-unicode');
    warn.mockRestore();
  });

  it('passes other attributes through, so a caller can hide it or label it', () => {
    const { container } = render(<Icon type="check-circle" aria-hidden="true" className="extra" />);
    const icon = container.querySelector('i');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('extra');
  });

  it('takes the small size', () => {
    const { container } = render(<Icon type="trash" size="small" />);
    expect(container.querySelector('i')).toHaveClass('icon-small');
  });

  it('still draws the font icons the old way', () => {
    const { container } = render(<Icon type="check" />);
    const icon = container.querySelector('i');
    expect(icon).not.toHaveClass('icon-svg');
    expect(icon.querySelector('svg')).toBeNull();
    expect(icon.style.content).toBeTruthy();
  });

  it('warns about a type it does not know', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Icon type="no-such-icon" />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Icon type not recognized'));
    warn.mockRestore();
  });
});
