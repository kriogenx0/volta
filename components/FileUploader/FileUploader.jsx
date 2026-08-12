import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './FileUploader.scss';

const FileUploader = ({
  accept, fileName: fileNameProp, percent, onChange, onCancel, allowDragAndDrop, multiple, complete
}) => {
  const [draggingIn, setDraggingIn] = useState(false);

  const selectFiles = useCallback((files) => {
    onChange(files);
  }, [onChange]);

  const handleWindowDragLeave = useCallback((e) => {
    e.preventDefault && e.preventDefault();
    setDraggingIn(false);
  }, []);

  const handleWindowDrag = useCallback((e) => {
    const isFile = _.includes(_.get(e, 'dataTransfer.types'), 'Files');
    if (isFile) {
      e.preventDefault && e.preventDefault();
      setDraggingIn(true);
    }
  }, []);

  const handleWindowDrop = useCallback((e) => {
    e.preventDefault && e.preventDefault();
    setDraggingIn(false);
  }, []);

  useEffect(() => {
    if (!allowDragAndDrop) return undefined;

    const el = window;
    el.addEventListener('dragleave', handleWindowDragLeave);
    el.addEventListener('dragover', handleWindowDrag);
    el.addEventListener('drop', handleWindowDrop);

    return () => {
      el.removeEventListener('dragleave', handleWindowDragLeave);
      el.removeEventListener('dragover', handleWindowDrag);
      el.removeEventListener('drop', handleWindowDrop);
    };
  }, [allowDragAndDrop, handleWindowDragLeave, handleWindowDrag, handleWindowDrop]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIn((prev) => (prev != 2 ? 2 : prev));
  };

  const handleDrop = (e) => {
    selectFiles(e.dataTransfer.files);
    setDraggingIn(false);
  };

  const handleInputFileSelect = (input) => (e) => {
    selectFiles(e.target.files);
    input.removeEventListener('change', handleInputFileSelect);
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = accept;

    const listener = handleInputFileSelect(input);
    input.addEventListener('change', listener);
    input.click();
  };

  let fileName = fileNameProp;
  const inProgress = percent !== null && percent !== undefined;
  const readyToUpload = !fileName && !inProgress;

  const hover = draggingIn === 2;

  if (hover) fileName = 'Drop It!';
  else if (draggingIn) fileName = 'Drop Here';

  return (
    <div className='volta-file_uploader'>
      <div className={`box${complete ? ' complete' : ''}${hover ? ' box-hover' : ''}`} title={fileName} onClick={handleFileSelect} onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className='text'>
          {fileName}
        </div>
        { complete ? null :
          <div className='percent' style={{width: percent ? percent + '%' : 0}} />
        }
      </div>
      { readyToUpload ?
          <div className='action' onClick={handleFileSelect}>
            <i className="fa fa-arrow-circle-o-up" aria-hidden="true" />
            <span> Upload</span>
          </div>
        : null
      }
      { inProgress ?
          <div className='action' onClick={onCancel}>
            <i className="fa fa-times-circle-o" aria-hidden="true" />
          </div>
        : null
      }
    </div>
  );
};

FileUploader.propTypes = {
  accept: PropTypes.string,
  fileName: PropTypes.string,
  percent: PropTypes.number,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  allowDragAndDrop: PropTypes.bool
};

FileUploader.defaultProps = {
  allowDragAndDrop: true
};

export default FileUploader;
