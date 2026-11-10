import { render } from '@testing-library/react';

import Icon from '../../components/Icon/Icon';
import svgIcons, { aliasesOf, iconNames } from '../../components/Icon/svgIcons';

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
      svgIcons[type].forEach((shape) => expect(typeof shape === 'string' ? shape : shape.d).toMatch(valid));
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

  it('still draws the font icons that have no drawing the old way', () => {
    const { container } = render(<Icon type="facebook" />);
    const icon = container.querySelector('i');
    expect(icon).not.toHaveClass('icon-svg');
    expect(icon.querySelector('svg')).toBeNull();
    expect(icon.style.content).toBeTruthy();
  });

  it('still draws SF Symbols that have no drawing as characters', () => {
    const { container } = render(<Icon type="applewatch" />);
    const icon = container.querySelector('i');
    expect(icon).toHaveClass('icon-unicode');
    expect(icon.querySelector('svg')).toBeNull();
  });

  it('warns about a type it does not know', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Icon type="no-such-icon" />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Icon type not recognized'));
    warn.mockRestore();
  });

  describe('the drawings for the font icons', () => {
    it('cover the icons the library itself uses, so none of them needs a font', () => {
      ['chevron.down', 'circle.fill', 'video.slash', 'list.clipboard', 'multiply', 'xmark', 'ellipsis',
        'chevron.backward.circle.fill', 'folder.fill', 'doc.fill', 'image', 'rectangle.compress.vertical',
        'rectangle.expand.vertical', 'checkmark.circle.fill', 'xmark.circle.fill', 'exclamationmark.circle.fill']
        .forEach((type) => expect(Object.keys(svgIcons)).toContain(type));
    });

    it('cover the icons the styleguide grid used to show', () => {
      ['chevron.right', 'chevron.left', 'chevron.down', 'chevron.up', 'xmark', 'plus', 'minus', 'checkmark',
        'magnifyingglass', 'trash', 'pencil', 'square.and.pencil', 'doc', 'folder', 'gear', 'bell', 'person',
        'person.crop.circle', 'envelope', 'phone', 'star', 'heart', 'bookmark', 'flag', 'arrow.right', 'arrow.left',
        'arrow.up', 'arrow.down', 'circle.fill', 'checkmark.circle.fill', 'xmark.circle.fill', 'exclamationmark.circle.fill']
        .forEach((type) => expect(Object.keys(svgIcons)).toContain(type));
    });

    it('share one drawing between the names for the X', () => {
      ['x', 'close', 'multiply', 'times'].forEach((alias) => expect(svgIcons[alias]).toBe(svgIcons.xmark));
    });

    it('draws a solid icon as a filled shape with its glyph cut out in the page colour', () => {
      const { container } = render(<Icon type="checkmark.circle.fill" />);
      const paths = container.querySelectorAll('svg path');
      expect(paths).toHaveLength(2);
      expect(paths[0]).toHaveClass('icon-fill');
      expect(paths[0]).toHaveAttribute('fill', 'currentColor');
      expect(paths[0]).toHaveAttribute('stroke', 'none');
      expect(paths[1]).toHaveClass('icon-knockout');
    });

    it('lists each drawing once for a grid, and every name resolves to one', () => {
      expect(iconNames.length).toBeGreaterThan(40);
      expect(new Set(iconNames).size).toBe(iconNames.length);
      iconNames.forEach((name) => expect(svgIcons[name]).toBeDefined());
      expect(aliasesOf('xmark')).toEqual(expect.arrayContaining(['x', 'close', 'multiply', 'times']));
    });

    it('stays inside the 24 x 24 grid', () => {
      iconNames.forEach((name) => {
        svgIcons[name].forEach((shape) => {
          const d = typeof shape === 'string' ? shape : shape.d;
          // Absolute coordinates only appear after M/L/C/A/etc.; checking every number is a safe bound
          (d.match(/-?\d+(\.\d+)?/g) || []).forEach((n) => expect(Math.abs(Number(n))).toBeLessThanOrEqual(24));
        });
      });
    });
  });
});
