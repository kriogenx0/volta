import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../Button';
import Empty from '../Empty';
import Loader from '../Loader';
import Icon from '../Icon';

import FileUtil from '../../util/FileUtil';

import "./FileManager.scss";

const FileManager = ({ files, loadingFiles, onFileSelect, onPathBack, path }) => {

  const pathComponents = (typeof path === 'string') ? path.split('/') : path;

  return (
    <div className="volta-file_manager">
      <div className='l-row'>
        <Button onClick={onPathBack}>
          <Icon type='chevron.backward.circle.fill' />
        </Button>
        <div className='path'>
          {_.map(pathComponents, p => (
            <span key={p}>
              {p}
            </span>
          ))}
        </div>
      </div>
        <div className='files'>
          {loadingFiles ? <Loader /> : (
            files && files.length > 0 ?
              _.map(files, file => (
                <div key={file} className='file' onClick={() => onFileSelect && onFileSelect(file)}>
                  <div className='file-icon'>
                    <Icon type={FileUtil.isDirectory(file) ? 'folder.fill' : 'doc.fill'} />
                  </div>
                  {FileUtil.stripTrailingSlash(file)}
                </div>
              ))
              : <Empty>No files</Empty>
          )}
      </div>
    </div>
  )
};

FileManager.propTypes = {
  files: PropTypes.arrayOf(PropTypes.string),
  loadingFiles: PropTypes.bool,
  onFileSelect: PropTypes.func,
  onPathBack: PropTypes.func,
  path: PropTypes.array
};

export default FileManager;