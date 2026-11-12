import fs from 'fs';
import path from 'path';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Toggle from '../../components/Toggle/Toggle';

describe('Toggle', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toggle />);
    expect(container).toBeInTheDocument();
  });

  it('is a checkbox that takes its accessible name from aria-label', () => {
    render(<Toggle aria-label="Dark mode" />);
    expect(screen.getByRole('checkbox', { name: 'Dark mode' })).not.toBeChecked();
  });

  it('starts on with defaultChecked and flips on its own when uncontrolled', () => {
    render(<Toggle aria-label="Dark mode" defaultChecked />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
    fireEvent.click(input);
    expect(input).not.toBeChecked();
  });

  it('can be shown on without an onChange handler and without React warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Toggle aria-label="Dark mode" checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('adds the checked class only when checked', () => {
    const { container, rerender } = render(<Toggle aria-label="Dark mode" checked={false} />);
    expect(container.firstChild).toHaveClass('volta-toggle');
    expect(container.firstChild).not.toHaveClass('toggle-checked');
    rerender(<Toggle aria-label="Dark mode" checked />);
    expect(container.firstChild).toHaveClass('toggle-checked');
  });

  it('reports the new state and follows a controlling parent', () => {
    const states = [];
    const Controlled = () => {
      const [on, setOn] = useState(false);
      return <Toggle aria-label="Notifications" checked={on} onChange={(e) => { states.push(e.target.checked); setOn(e.target.checked); }} />;
    };
    render(<Controlled />);
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(input).toBeChecked();
    fireEvent.click(input);
    expect(input).not.toBeChecked();
    expect(states).toEqual([true, false]);
  });

  it('passes name and value to the input', () => {
    render(<Toggle aria-label="Notifications" name="notifications" value="yes" />);
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('name', 'notifications');
    expect(input).toHaveAttribute('value', 'yes');
  });

  it('really disables the input when isDisabled, not just the look', () => {
    const { container } = render(<Toggle aria-label="Locked" isDisabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(container.firstChild).toHaveClass('toggle-disabled');
  });

  it('is enabled by default', () => {
    const { container } = render(<Toggle aria-label="Dark mode" />);
    expect(screen.getByRole('checkbox')).toBeEnabled();
    expect(container.firstChild).not.toHaveClass('toggle-disabled');
  });

  it('adds a custom className to the wrapper', () => {
    const { container } = render(<Toggle aria-label="Dark mode" className="extra" />);
    expect(container.firstChild).toHaveClass('volta-toggle', 'extra');
  });
});

// jsdom loads no CSS, so the colours are checked in the stylesheet's source.
describe('Toggle colours follow the theme', () => {
  const scss = fs.readFileSync(path.join(__dirname, '../../components/Toggle/Toggle.scss'), 'utf8');
  const rule = (selector) => scss.match(new RegExp(`${selector.replace('.', '\\.')} \\{[^}]*\\}`))[0];

  it('draws the knob in the page colour, so it is dark in dark mode', () => {
    expect(rule('.toggle-switch')).toMatch(/background-color:\s*\$color_base;/);
    expect(rule('.toggle-switch')).not.toMatch(/\$color_white/);
  });

  it('draws the off half of the track in the page colour too', () => {
    expect(rule('.toggle-bg-negative')).toMatch(/background:\s*\$color_base;/);
  });

  it('keeps the accent for the on half', () => {
    expect(rule('.toggle-bg')).toMatch(/background:\s*\$color_active;/);
  });
});

describe('Toggle marks', () => {
  it('shows no marks by default', () => {
    const { container } = render(<Toggle aria-label="Dark mode" />);
    expect(container.querySelector('.toggle-mark')).toBeNull();
    expect(container.firstChild).not.toHaveClass('toggle-marks');
  });

  it('prints an I on the on side and an O on the off side with showMarks', () => {
    const { container } = render(<Toggle aria-label="Dark mode" showMarks />);
    expect(container.firstChild).toHaveClass('toggle-marks');
    expect(container.querySelector('.toggle-mark-on')).toHaveTextContent('I');
    expect(container.querySelector('.toggle-mark-off')).toHaveTextContent('O');
  });

  it('hides the marks from assistive technology, so the switch is still just a checkbox', () => {
    render(<Toggle aria-label="Dark mode" showMarks />);
    document.querySelectorAll('.toggle-mark').forEach((mark) => expect(mark).toHaveAttribute('aria-hidden', 'true'));
    expect(screen.getByRole('checkbox', { name: 'Dark mode' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Dark mode' })).toHaveAccessibleName('Dark mode');
  });

  it('puts both marks on the track, whatever the state, so the knob decides which shows', () => {
    const { container, rerender } = render(<Toggle aria-label="x" showMarks checked onChange={() => {}} />);
    expect(container.querySelectorAll('.toggle-track .toggle-mark')).toHaveLength(2);
    rerender(<Toggle aria-label="x" showMarks checked={false} onChange={() => {}} />);
    expect(container.querySelectorAll('.toggle-track .toggle-mark')).toHaveLength(2);
  });

  it('draws the on mark in the colour that reads on the accent, and does not let marks take clicks', () => {
    const scss = fs.readFileSync(path.join(__dirname, '../../components/Toggle/Toggle.scss'), 'utf8');
    expect(scss).toMatch(/\.toggle-mark-on \{[^}]*color:\s*var\(--v-on-accent\)/);
    expect(scss).toMatch(/\.toggle-mark \{[^}]*pointer-events:\s*none/);
  });

  describe('knob size', () => {
    it('is small by default, and `md` keeps the larger knob', () => {
      const { container, rerender } = render(<Toggle aria-label="Alerts" />);
      expect(container.querySelector('.volta-toggle')).toHaveClass('volta-toggle--knob_sm');
      rerender(<Toggle aria-label="Alerts" knobSize="md" />);
      expect(container.querySelector('.volta-toggle')).toHaveClass('volta-toggle--knob_md');
      expect(Toggle.knobSizes).toEqual(['sm', 'md']);
    });

    it('insets the small knob and keeps the old 25px knob and positions for md', () => {
      const scss = fs.readFileSync(path.join(__dirname, '../../components/Toggle/Toggle.scss'), 'utf8');
      expect(scss).toMatch(/--toggle-knob:\s*17px;\s*--toggle-knob-off:\s*3px;\s*--toggle-knob-on:\s*23px;/);
      expect(scss).toMatch(/\.volta-toggle--knob_md \{\s*--toggle-knob:\s*25px;\s*--toggle-knob-off:\s*-1px;\s*--toggle-knob-on:\s*20px;/);
    });

    it('keeps the accent fill out of the track when off and over all of it when on, so an inset knob has no patch of accent around it', () => {
      const fs = require('fs');
      const path = require('path');
      const scss = fs.readFileSync(path.join(__dirname, '../../components/Toggle/Toggle.scss'), 'utf8');
      expect(scss).toMatch(/\.toggle-bg \{[^}]*left:\s*calc\(-100% - 10px\);[^}]*width:\s*calc\(100% \+ 20px\)/);
      expect(scss).toMatch(/:checked ~ \.toggle-body \{[\s\S]*?\.toggle-bg \{\s*left:\s*-10px;/);
    });
  });
});
