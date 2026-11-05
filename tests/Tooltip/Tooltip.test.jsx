import { render, screen, fireEvent } from '@testing-library/react';

import Tooltip from '../../components/Tooltip/Tooltip';

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
    expect(document.querySelector('.volta-tooltip')).not.toBeInTheDocument();
  });

  it('applies the gravity class to the tooltip body', () => {
    render(<Tooltip title="Helpful text" gravity="left">Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(document.querySelector('.volta-tooltip')).toHaveClass('left');
  });

  it('places the tooltip above and 8px away by default', () => {
    render(<Tooltip title="Helpful text">Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    const body = screen.getByRole('tooltip');
    expect(body).toHaveClass('volta-tooltip', 'up');
    expect(body.style.getPropertyValue('--v-tooltip-gap')).toBe('8px');
  });

  it.each(['up', 'down', 'left', 'right'])('supports the %s gravity', (gravity) => {
    render(<Tooltip title="Helpful text" gravity={gravity}>Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveClass(gravity);
  });

  it('uses the margin prop as the gap to the trigger', () => {
    render(<Tooltip title="Helpful text" margin={20}>Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip').style.getPropertyValue('--v-tooltip-gap')).toBe('20px');
  });

  it('shows on keyboard focus and hides on blur', () => {
    render(
      <Tooltip title="Helpful text">
        <button type="button">Focus me</button>
      </Tooltip>
    );
    const button = screen.getByRole('button', { name: 'Focus me' });
    fireEvent.focus(button);
    expect(screen.getByText('Helpful text')).toBeInTheDocument();
    fireEvent.blur(button);
    expect(screen.queryByText('Helpful text')).not.toBeInTheDocument();
  });

  it('describes the trigger with the tooltip while it is open', () => {
    render(<Tooltip title="Helpful text" data-testid="wrap">Hover me</Tooltip>);
    const wrap = screen.getByTestId('wrap');
    expect(wrap).not.toHaveAttribute('aria-describedby');

    fireEvent.mouseOver(wrap);
    const body = screen.getByRole('tooltip');
    expect(wrap).toHaveAttribute('aria-describedby', body.id);
    expect(body.id).not.toBe('');

    fireEvent.mouseOut(wrap);
    expect(wrap).not.toHaveAttribute('aria-describedby');
  });

  it('keeps a custom className and passes other props to the wrapper', () => {
    const onClick = jest.fn();
    render(<Tooltip title="Helpful text" className="custom" data-testid="wrap" onClick={onClick}>Hover me</Tooltip>);
    const wrap = screen.getByTestId('wrap');
    expect(wrap).toHaveClass('volta-tooltip_wrap', 'custom');
    fireEvent.click(wrap);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('closes when the title is removed while open', () => {
    const { rerender } = render(<Tooltip title="Helpful text">Hover me</Tooltip>);
    fireEvent.mouseOver(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    rerender(<Tooltip title={null}>Hover me</Tooltip>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
