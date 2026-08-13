import { fireEvent, render, screen } from '@testing-library/react';

import TagInput from '../../components/TagInput/TagInput';

describe('TagInput', () => {
  it('renders without crashing', () => {
    const { container } = render(<TagInput />);
    expect(container).toBeInTheDocument();
  });

  it('renders an accessible remove button for each tag', () => {
    const onChange = jest.fn();
    render(<TagInput tags={['Design', 'React']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove Design' }));

    expect(onChange).toHaveBeenCalledWith(['React']);
    expect(screen.queryByText('Design')).not.toBeInTheDocument();
  });
});
