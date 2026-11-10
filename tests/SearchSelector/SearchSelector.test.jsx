import { render, screen, fireEvent } from '@testing-library/react';

import SearchSelector from '../../components/SearchSelector/SearchSelector';

const FRUITS = ['Apple', 'Apricot', 'Banana'];
const onType = (query) => FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()));

const type = (value) => fireEvent.change(screen.getByRole('textbox'), { target: { value } });
const tagsShown = (container) => [...container.querySelectorAll('.search_selector-tags .tag')].map((node) => node.textContent);

describe('SearchSelector', () => {
  it('renders without crashing', () => {
    const { container } = render(<SearchSelector />);
    expect(container).toBeInTheDocument();
  });

  it('keeps the search box controlled from the first render', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<SearchSelector open onType={onType} />);
    type('ap');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('lists the items returned by onType as the user types', () => {
    render(<SearchSelector open onType={onType} />);
    type('ap');
    expect(screen.getByRole('button', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apricot' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Banana' })).toBeNull();
  });

  it('adds every clicked result, not just the first', () => {
    const onChange = jest.fn();
    const { container } = render(<SearchSelector open onType={onType} onChange={onChange} />);
    type('ap');
    fireEvent.click(screen.getByRole('button', { name: 'Apple' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apricot' }));
    expect(tagsShown(container)).toEqual(['Apple', 'Apricot']);
    expect(onChange).toHaveBeenLastCalledWith(['Apple', 'Apricot']);
  });

  it('ignores a repeat click on the same result by default', () => {
    const onChange = jest.fn();
    const { container } = render(<SearchSelector open onType={onType} onChange={onChange} />);
    type('ap');
    fireEvent.click(screen.getByRole('button', { name: 'Apple' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apple' }));
    expect(tagsShown(container)).toEqual(['Apple']);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('keeps one selection when multipleItems is off', () => {
    const { container } = render(<SearchSelector open multipleItems={false} onType={onType} />);
    type('ap');
    fireEvent.click(screen.getByRole('button', { name: 'Apple' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apricot' }));
    expect(tagsShown(container)).toEqual(['Apricot']);
  });

  it('closes and calls onClose when the overlay is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<SearchSelector open onClose={onClose} />);
    expect(container.querySelector('.volta-modal')).toBeInTheDocument();
    fireEvent.click(container.querySelector('.volta-modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not put a stray "null" class on the popover', () => {
    const { container } = render(<SearchSelector open />);
    expect(container.querySelector('.volta-modal').className).not.toMatch(/null|undefined/);
  });

  it('names the search box and the popover', () => {
    render(<SearchSelector open onType={onType} />);
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });

  it('lets the same result be picked twice when uniqueItems is off', () => {
    const { container } = render(<SearchSelector open uniqueItems={false} onType={onType} />);
    type('ap');
    fireEvent.click(screen.getByRole('button', { name: 'Apple' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apple' }));
    expect(tagsShown(container)).toEqual(['Apple', 'Apple']);
  });

  it('shows no results and does not throw when there is no onType', () => {
    render(<SearchSelector open />);
    expect(() => type('ap')).not.toThrow();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('shows no results when onType returns nothing', () => {
    render(<SearchSelector open onType={() => []} />);
    type('zzz');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('follows the open prop, closing and reopening', () => {
    const { container, rerender } = render(<SearchSelector open={false} />);
    expect(container.querySelector('.volta-modal')).toBeNull();
    rerender(<SearchSelector open />);
    expect(container.querySelector('.volta-modal')).toBeInTheDocument();
    rerender(<SearchSelector open={false} />);
    expect(container.querySelector('.volta-modal')).toBeNull();
  });

  it('works without onChange or onClose', () => {
    const { container } = render(<SearchSelector open onType={onType} />);
    type('ap');
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Apple' }))).not.toThrow();
    expect(() => fireEvent.click(container.querySelector('.volta-modal'))).not.toThrow();
  });
});
