import PropTypes from 'prop-types';

import Button from '../Button';
import Empty from '../Empty';
import Loader from '../Loader';
import Icon from '../Icon';

import FileUtil from '../../util/FileUtil';

import "./FileManager.scss";
import { map } from '../../util/collection';

// Lists the files of one folder under the path that leads to it. `files` are
// plain strings, and a name ending in "/" is a folder. `path` is the folder
// names from the root (or one "a/b/c" string); the root has none.
const FileManager = ({ files, loadingFiles, onFileSelect, onPathBack, path }) => {

  const pathComponents = (typeof path === 'string' ? path.split('/') : path || []).filter(Boolean);

  return (
    <div className="volta-file_manager">
      <div className='l-row'>
        <Button onClick={onPathBack} disabled={!onPathBack} aria-label="Back to the parent folder">
          <Icon type='chevron.backward.circle.fill' aria-hidden="true" />
        </Button>
        <div className='path'>
          {pathComponents.length > 0 ? pathComponents.map((p, i) => (
            <span key={`${i}-${p}`}>
              {p}
            </span>
          )) : <span>/</span>}
        </div>
      </div>
      <div className='files' aria-busy={loadingFiles ? true : undefined}>
        {loadingFiles ? <Loader /> : (
          files && files.length > 0 ?
            map(files, file => (
              <button type="button" key={file} className='file' onClick={() => onFileSelect && onFileSelect(file)}>
                <span className='file-icon'>
                  <Icon type={FileUtil.isDirectory(file) ? 'folder.fill' : 'doc.fill'} aria-hidden="true" />
                </span>
                {FileUtil.stripTrailingSlash(file)}
              </button>
            ))
            : <Empty>No files</Empty>
        )}
      </div>
    </div>
  );
};

FileManager.propTypes = {
  // File and folder names in the current folder; folders end in "/"
  files: PropTypes.arrayOf(PropTypes.string),
  loadingFiles: PropTypes.bool,
  // Called with the name of the file or folder clicked
  onFileSelect: PropTypes.func,
  // Called when the back button is clicked; without it the button is disabled
  onPathBack: PropTypes.func,
  // Folder names from the root down, or one "a/b/c" string
  path: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
};

export default FileManager;
