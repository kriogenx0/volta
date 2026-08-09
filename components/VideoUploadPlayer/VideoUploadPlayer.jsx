import VideoPlayer from '../VideoPlayer';
import ProgressBar from '../ProgressBar';

import './VideoUploadPlayer.scss';

export default class VideoUploadPlayer extends React.Component {
  static propTypes = {
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
    input.accept = 'video/*';

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

  handleBoxClick = () => {
    const inProgress = this.props.percent !== null && this.props.percent !== undefined;
    if (inProgress)
      this.props.onCancel();
    else
      this.handleFileSelect();
  };

  render() {
    const { url, onChange, percent, onCancel, complete, fileName } = this.props;
    const { draggingIn } = this.state;

    const inProgress = percent !== null && percent !== undefined;
    // const complete = fileName && !inProgress;
    const readyToUpload = !fileName && !inProgress;

    const percentWidth = inProgress ? percent : 0;

    const dragging = draggingIn === 2;

    let label = fileName;
    if (dragging) label = 'Drop It!';
    else if (draggingIn) label = 'Drop Here';
    if (!label) label = 'Upload';

    const videoExists = url && url.length;

    return (
      <div className='ui-video_upload_player' onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
        { videoExists ? <div className='player'>
            <VideoPlayer src={url} />
          </div> : null
        }
        <div className={`box${complete ? ' complete' : ''}${dragging ? ' box-dragging' : ''}${videoExists ? ' video_exists' : ''}`} title={label} onClick={this.handleBoxClick}>
          <div className='label'>
            {label}
          </div>
          { !complete && inProgress ?
            <div className='percent' style={{width: percent ? percent + '%' : 0}} /> : null
          }
          {/* <input accept={accept} type='file' onChange={onChange} ref={this.fileInput} /> */ }
        </div>
      </div>
    );
  }
}
