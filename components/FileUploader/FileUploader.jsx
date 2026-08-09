import ProgressBar from '../ProgressBar';

import './FileUploader.scss';

export default class FileUploader extends React.Component {
  static propTypes = {
    accept: PropTypes.string,
    fileName: PropTypes.string,
    percent: PropTypes.number,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    allowDragAndDrop: PropTypes.bool
  };

  static defaultProps = {
    allowDragAndDrop: true
  };

  state = {
    draggingIn: false
  };

  /*
  fileInput = React.createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.fileName != this.props.fileName) {
      this.fileInput.current.value = null;
    }
  }
  */

  componentDidMount() {
    if (this.props.allowDragAndDrop) this.addEventListeners();
  }

  componentWillUnmount() {
    if (this.props.allowDragAndDrop) this.removeEventListeners();
  }

  addEventListeners = () => {
    const el = window;
    el.addEventListener('dragleave', this.handleWindowDragLeave);
    el.addEventListener('dragover', this.handleWindowDrag);
    el.addEventListener('drop', this.handleWindowDrop);
  }

  removeEventListeners() {
    const el = window;
    el.removeEventListener('dragleave', this.handleWindowDragLeave);
    el.removeEventListener('dragover', this.handleWindowDrag);
    el.removeEventListener('drop', this.handleWindowDrop);
  };

  selectFiles = files => {
    this.props.onChange(files);
  };

  handleWindowDragLeave = e => {
    e.preventDefault && e.preventDefault();
    this.setState({ draggingIn: false });
  };

  handleWindowDrag = e => {
    const isFile = _.includes( _.get(e, 'dataTransfer.types'), 'Files');
    if (isFile) {
      e.preventDefault && e.preventDefault();
      this.setState({ draggingIn: true });
    }
  };

  handleWindowDrop = e => {
    e.preventDefault && e.preventDefault();
    this.setState({ draggingIn: false });
  };

  handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.draggingIn != 2) {
      // console.log('handleDragOver', e);
      this.setState({ draggingIn: 2 });
    }
  }

  handleDrop = e => {
    // console.log('handleDrop', e);
    this.selectFiles(e.dataTransfer.files);
    this.setState({ draggingIn: false });
  };

  handleFileSelect = () => {
    // console.log('handleFileSelect', this.fileInput);
    // this.fileInput.current.click();

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = this.props.multiple;
    input.accept = this.props.accept;

    input.addEventListener('change', this.handleInputFileSelect);
    input.click();
    this.input = input;
  }

  handleInputFileSelect = e => {
    this.selectFiles(e.target.files);
    if (this.input) {
      this.input.removeEventListener('change', this.handleInputFileSelect);
      delete this.input;
    }
  };

  render() {
    const { accept, onChange, percent, onCancel, complete } = this.props;
    let { fileName } = this.props;
    const { draggingIn } = this.state;

    const inProgress = percent !== null && percent !== undefined;
    // const complete = fileName && !inProgress;
    const readyToUpload = !fileName && !inProgress;

    const percentWidth = inProgress ? percent : 0;

    const hover = draggingIn === 2;

    if (hover) fileName = 'Drop It!';
    else if (draggingIn) fileName = 'Drop Here';

    return (
      <div className='ui-file_uploader'>
        <div className={`box${complete ? ' complete' : ''}${hover ? ' box-hover' : ''}`} title={fileName} onClick={this.handleFileSelect} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
          <div className='text'>
            {fileName}
          </div>
          { complete ? null :
            <div className='percent' style={{width: percent ? percent + '%' : 0}} />
          }
        </div>
        { readyToUpload ?
            <div className='action' onClick={this.handleFileSelect}>
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
        {/* <input accept={accept} type='file' onChange={onChange} ref={this.fileInput} /> */ }
      </div>
    );
  }
}
