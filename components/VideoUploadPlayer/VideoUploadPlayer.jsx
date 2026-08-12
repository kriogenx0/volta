import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import VideoPlayer from '../VideoPlayer';

import './VideoUploadPlayer.scss';

const VideoUploadPlayer = ({
  url, onChange, percent, onCancel, complete, fileName, allowDragAndDrop, multiple
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
    input.accept = 'video/*';

    const listener = handleInputFileSelect(input);
    input.addEventListener('change', listener);
    input.click();
  };

  const handleBoxClick = () => {
    const inProgress = percent !== null && percent !== undefined;
    if (inProgress)
      onCancel();
    else
      handleFileSelect();
  };

  const inProgress = percent !== null && percent !== undefined;

  const dragging = draggingIn === 2;

  let label = fileName;
  if (dragging) label = 'Drop It!';
  else if (draggingIn) label = 'Drop Here';
  if (!label) label = 'Upload';

  const videoExists = url && url.length;

  return (
    <div className='volta-video_upload_player' onDragOver={handleDragOver} onDrop={handleDrop}>
      { videoExists ? <div className='player'>
          <VideoPlayer src={url} />
        </div> : null
      }
      <div className={`box${complete ? ' complete' : ''}${dragging ? ' box-dragging' : ''}${videoExists ? ' video_exists' : ''}`} title={label} onClick={handleBoxClick}>
        <div className='label'>
          {label}
        </div>
        { !complete && inProgress ?
          <div className='percent' style={{width: percent ? percent + '%' : 0}} /> : null
        }
      </div>
    </div>
  );
};

VideoUploadPlayer.propTypes = {
  fileName: PropTypes.string,
  percent: PropTypes.number,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  allowDragAndDrop: PropTypes.bool
};

VideoUploadPlayer.defaultProps = {
  allowDragAndDrop: true
};

export default VideoUploadPlayer;
