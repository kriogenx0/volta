import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';

import Checkbox from '../../components/Checkbox/Checkbox';

describe('Checkbox', () => {
  it('renders without crashing', () => {
    const { container } = render(<Checkbox />);
    expect(container).toBeInTheDocument();
  });

  it('is a checkbox named by its label', () => {
    render(<Checkbox label="Check me" />);
    expect(screen.getByRole('checkbox', { name: 'Check me' })).not.toBeChecked();
  });

  it('can be named with aria-label when it has no visible label', () => {
    render(<Checkbox aria-label="Select row 3" />);
    expect(screen.getByRole('checkbox', { name: 'Select row 3' })).toBeInTheDocument();
  });

  it('starts checked with defaultChecked and toggles on its own', () => {
    render(<Checkbox label="Check me" defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('reports changes and follows `checked` when controlled', () => {
    const onChange = jest.fn((e) => e.target.checked);
    const { rerender } = render(<Checkbox label="Check me" checked={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
    // controlled: stays as the parent says until it re-renders
    expect(checkbox).not.toBeChecked();
    rerender(<Checkbox label="Check me" checked onChange={onChange} />);
    expect(checkbox).toBeChecked();
  });

  it('passes name and value through to the input', () => {
    render(<Checkbox label="Apples" name="fruits" value="apples" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'fruits');
    expect(checkbox).toHaveAttribute('value', 'apples');
  });

  it('disables the input and marks the wrapper when disabled', () => {
    const { container } = render(<Checkbox label="Locked" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(container.firstChild).toHaveClass('volta-checkbox', 'checkbox-disabled');
  });

  it('does not mark the wrapper disabled by default', () => {
    const { container } = render(<Checkbox label="Open" />);
    expect(container.firstChild).not.toHaveClass('checkbox-disabled');
  });
});

// jsdom loads no CSS, so the label colour is checked in the stylesheet's source.
describe('Checkbox label colour', () => {
  const scss = fs.readFileSync(path.join(__dirname, '../../components/Checkbox/Checkbox.scss'), 'utf8');
  const rootRule = scss.match(/\.volta-checkbox \{[\s\S]*?\n  input \{/)[0];

  it('is the subtle text colour, not the full-strength one, so it sits closer to the border', () => {
    expect(rootRule).toMatch(/color:\s*\$color_trim_subtle;/);
    expect(rootRule).not.toMatch(/color:\s*\$color_trim;/);
  });

  it('keeps the box border at its own colour and the hover and disabled colours', () => {
    expect(scss).toMatch(/border:\s*1\.5px solid \$color_base_less_subtle;/);
    expect(scss).toMatch(/&:hover \{\s*color:\s*\$color_active;/);
    expect(scss).toMatch(/span \{\s*color:\s*\$color_inactive;/);
  });
});
