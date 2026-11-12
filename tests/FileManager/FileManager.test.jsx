import { render, screen, fireEvent, within } from '@testing-library/react';

import FileManager from '../../components/FileManager/FileManager';

const FILES = ['documents/', 'photos/', 'notes.txt'];

const pathNames = (container) => [...container.querySelectorAll('.path span')].map((span) => span.textContent);

describe('FileManager', () => {
  it('renders without crashing', () => {
    const { container } = render(<FileManager />);
    expect(container).toBeInTheDocument();
  });

  it('shows an empty message when there are no files', () => {
    render(<FileManager />);
    expect(screen.getByText('No files')).toBeInTheDocument();
    render(<FileManager files={[]} />);
    expect(screen.getAllByText('No files')).toHaveLength(2);
  });

  describe('files', () => {
    it('lists each file once, folders without their trailing slash', () => {
      render(<FileManager files={FILES} />);
      expect(screen.getByRole('button', { name: 'documents' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'photos' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'notes.txt' })).toBeInTheDocument();
    });

    it('tells folders from files by their icon', () => {
      const { container } = render(<FileManager files={FILES} />);
      const icons = [...container.querySelectorAll('.file .volta-icon')].map((icon) => icon.getAttribute('data-type'));
      expect(icons).toEqual(['folder.fill', 'folder.fill', 'doc.fill']);
    });

    it('hides the decorative icons from assistive technology', () => {
      const { container } = render(<FileManager files={FILES} />);
      container.querySelectorAll('.volta-icon').forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('calls onFileSelect with the name exactly as given', () => {
      const onFileSelect = jest.fn();
      render(<FileManager files={FILES} onFileSelect={onFileSelect} />);
      fireEvent.click(screen.getByRole('button', { name: 'documents' }));
      fireEvent.click(screen.getByRole('button', { name: 'notes.txt' }));
      expect(onFileSelect.mock.calls).toEqual([['documents/'], ['notes.txt']]);
    });

    it('can be clicked without an onFileSelect', () => {
      render(<FileManager files={FILES} />);
      expect(() => fireEvent.click(screen.getByRole('button', { name: 'notes.txt' }))).not.toThrow();
    });
  });

  describe('loading', () => {
    it('shows a loader instead of the files', () => {
      const { container } = render(<FileManager files={FILES} loadingFiles />);
      expect(container.querySelector('.volta-loader')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'notes.txt' })).toBeNull();
      expect(screen.queryByText('No files')).toBeNull();
      expect(container.querySelector('.files')).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('path', () => {
    it('shows each folder of a path given as a list', () => {
      const { container } = render(<FileManager path={['documents', 'contracts']} />);
      expect(pathNames(container)).toEqual(['documents', 'contracts']);
    });

    it('splits a path given as a string and drops blank parts', () => {
      const { container } = render(<FileManager path="/documents/contracts/" />);
      expect(pathNames(container)).toEqual(['documents', 'contracts']);
    });

    it('shows the root as a slash, from "/" or from nothing', () => {
      const { container } = render(<FileManager path="/" />);
      expect(pathNames(container)).toEqual(['/']);
      const { container: bare } = render(<FileManager />);
      expect(pathNames(bare)).toEqual(['/']);
    });

    it('does not warn about repeated folder names', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<FileManager path={['backup', 'backup']} />);
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('back button', () => {
    it('has a name and calls onPathBack', () => {
      const onPathBack = jest.fn();
      render(<FileManager onPathBack={onPathBack} />);
      fireEvent.click(screen.getByRole('button', { name: 'Back to the parent folder' }));
      expect(onPathBack).toHaveBeenCalledTimes(1);
    });

    it('is disabled without an onPathBack', () => {
      render(<FileManager />);
      expect(screen.getByRole('button', { name: 'Back to the parent folder' })).toBeDisabled();
    });
  });

  it('keeps the back button in the top row, not the file list', () => {
    const { container } = render(<FileManager files={FILES} onPathBack={() => {}} />);
    expect(within(container.querySelector('.l-row')).getAllByRole('button')).toHaveLength(1);
    expect(within(container.querySelector('.files')).getAllByRole('button')).toHaveLength(3);
  });
});

describe('FileManager colours', () => {
  it('uses theme tokens alone, with no dark-mode overrides that would invert them', () => {
    const fs = require('fs');
    const path = require('path');
    const scss = fs.readFileSync(path.join(__dirname, '../../components/FileManager/FileManager.scss'), 'utf8');
    expect(scss).not.toMatch(/@include dark/);
    expect(scss).not.toMatch(/#[0-9a-fA-F]{3,6}\b|\bblack\b|\bwhite\b/);
  });
});
