import { render, screen, fireEvent } from '@testing-library/react';

import Tooltip from './Tooltip';

describe('Tooltip', () => {
  it('renders children without showing the tooltip body initially', () => {
    render(<Tooltip title="Helpful text">Hover me</Tooltip>);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByText('Helpful text')).not.toBeInTheDocument();
  });

  it('shows the tooltip body on mouse over', () => {
    render(<Tooltip title="Helpful text">Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(screen.getByText('Helpful text')).toBeInTheDocument();
  });

  it('hides the tooltip body on mouse out', () => {
    render(<Tooltip title="Helpful text">Hover me</Tooltip>);
    const wrap = screen.getByText('Hover me');
    fireEvent.mouseOver(wrap);
    expect(screen.getByText('Helpful text')).toBeInTheDocument();
    fireEvent.mouseOut(wrap);
    expect(screen.queryByText('Helpful text')).not.toBeInTheDocument();
  });

  it('never shows a tooltip body when no title is given', () => {
    render(<Tooltip>Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(document.querySelector('.c-tooltip')).not.toBeInTheDocument();
  });

  it('applies the gravity class to the tooltip body', () => {
    render(<Tooltip title="Helpful text" gravity="left">Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(document.querySelector('.c-tooltip')).toHaveClass('left');
  });
});
