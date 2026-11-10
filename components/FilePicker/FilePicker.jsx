import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import fileTyper from './filetyper';
import Button from '../Button';
import Icon from '../Icon';

import './FilePicker.scss';
import { map, each } from '../../util/collection';

const loadType = (fileType) => {
  if (fileType == 'image' || fileType == 'audio') {
    return fileType + '/*';
  } else {
    return null;
  }
};

const detectTypeClass = (type) => type.split('/')[0];

const noop = () => {};

const loadIcon = (file) => {
  if (!file || typeof file !== 'object') {
    return 'file';
  } else if (file.typeClass == 'audio') {
    return 'volume-up';
  } else if (file.typeClass == 'image') {
    return 'image';
  } else if (file.typeClass == 'video') {
    return 'video-camera';
  } else {
    return 'file';
  }
};

const buildDefaultFiles = (value) => {
  let files;
  if (!value) files = null;
  // A copy: the strings below are replaced by objects, which must not rewrite the caller's array
  else if (Array.isArray(value)) files = [...value];
  else files = [value];

  each(files, (file, i) => {
    if (typeof file == 'string') {
      const fileTyperObj = fileTyper(file);
      files[i] = {
        name: file,
        defaultLoaded: true,
        typeClass: fileTyperObj?.fileClass
        // TODO detectTypeClass
      };
    }
  });

  return files;
};

const FilePicker = ({
  className = null, defaultValue = null, onChange = noop, fileType = null, multiple = false, buttonLabel
}) => {
  const [files, setFiles] = useState(() => buildDefaultFiles(defaultValue));

  useEffect(() => {
    if (defaultValue) setFiles(buildDefaultFiles(defaultValue));
  }, [defaultValue]);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    onChange(newFiles);
  };

  const selectFileCallback = (newFiles) => {
    let updated;
    if (multiple) {
      // A new array: React ignores a state update to the array it already has
      updated = [...(files || [])];
      each(newFiles, file => {
        file.typeClass = detectTypeClass(file.type);
        updated.push(file);
      });
    } else {
      updated = newFiles;
      updated[0].typeClass = detectTypeClass(updated[0].type);
    }
    updateFiles(updated);
  };

  const selectFile = () => {
    const accept = loadType(fileType);

    // Create Input
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = !!multiple;
    if (accept) input.accept = accept;

    const handleFileSelect = event => {
      selectFileCallback(event.target.files);
      input.removeEventListener('change', handleFileSelect);
    };
    input.addEventListener('change', handleFileSelect);
    input.click();
  };

  const handleRemoveFile = (file) => {
    const remaining = files.filter((existing) => existing !== file);
    updateFiles(remaining);
  };

  const handleButtonFileSelect = () => {
    selectFile();
  };

  const label =
    buttonLabel ||
    (!multiple && files && files.length
      ? 'Change File'
      : 'Select File');

  return (
    <div
      className={`volta-file_picker${
        className ? ' ' + className : ''
      }`}
    >
      <Button
        className="file_picker-select"
        onClick={handleButtonFileSelect}
      >
        {label}
      </Button>
      {map(files, (file, i) => {
        const fileIcon = loadIcon(file);
        return (
          <div className="file_picker-file" key={i}>
            <div className="file-icon">
              <Icon type={fileIcon} />
            </div>
            <div className="file-name">{file.name}</div>
            <Button onClick={() => handleRemoveFile(file)}>
              <Icon type="xmark" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

FilePicker.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  fileType: PropTypes.string,
  multiple: PropTypes.bool,
  buttonLabel: PropTypes.string
};

export default FilePicker;
