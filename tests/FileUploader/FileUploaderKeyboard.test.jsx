import { render, screen, fireEvent } from '@testing-library/react';

import FileUploader from '../../components/FileUploader/FileUploader';
import VideoUploadPlayer from '../../components/VideoUploadPlayer/VideoUploadPlayer';

// Choosing a file works by making an <input type="file"> and clicking it
let pickerOpened;

beforeEach(() => {
  pickerOpened = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
  pickerOpened.mockRestore();
});

describe('FileUploader keyboard', () => {
  it('has a button that opens the file picker from the keyboard as well as the mouse', () => {
    render(<FileUploader />);
    const box = screen.getByRole('button', { name: 'Choose a file' });
    expect(box).toHaveAttribute('tabindex', '0');

    fireEvent.click(box);
    expect(pickerOpened).toHaveBeenCalledTimes(1);

    box.focus();
    fireEvent.keyDown(box, { key: 'Enter' });
    fireEvent.keyDown(box, { key: ' ' });
    expect(pickerOpened).toHaveBeenCalledTimes(3);
  });

  it('names the box by the file once there is one, not "Choose a file"', () => {
    render(<FileUploader fileName="photo.png" />);
    expect(screen.getByRole('button', { name: 'photo.png' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Choose a file' })).toBeNull();
  });

  it('has an Upload button that works from the keyboard', () => {
    render(<FileUploader />);
    const upload = screen.getByRole('button', { name: 'Upload' });
    upload.focus();
    fireEvent.keyDown(upload, { key: 'Enter' });
    expect(pickerOpened).toHaveBeenCalledTimes(1);
  });

  it('has a named Cancel button, which works from the keyboard, while uploading', () => {
    const onCancel = jest.fn();
    render(<FileUploader fileName="photo.png" percent={40} onCancel={onCancel} />);
    const cancel = screen.getByRole('button', { name: 'Cancel upload' });
    cancel.focus();
    fireEvent.keyDown(cancel, { key: ' ' });
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('does not open the picker for other keys', () => {
    render(<FileUploader />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Choose a file' }), { key: 'a' });
    expect(pickerOpened).not.toHaveBeenCalled();
  });
});

describe('VideoUploadPlayer keyboard', () => {
  it('has a button that opens the file picker from the keyboard as well as the mouse', () => {
    render(<VideoUploadPlayer />);
    const box = screen.getByRole('button', { name: 'Upload' });
    expect(box).toHaveAttribute('tabindex', '0');

    fireEvent.click(box);
    box.focus();
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(pickerOpened).toHaveBeenCalledTimes(2);
  });

  it('cancels from the keyboard while an upload is in progress', () => {
    const onCancel = jest.fn();
    render(<VideoUploadPlayer fileName="clip.mp4" percent={30} onCancel={onCancel} />);
    const box = screen.getByRole('button', { name: 'clip.mp4' });
    box.focus();
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(pickerOpened).not.toHaveBeenCalled();
  });
});
