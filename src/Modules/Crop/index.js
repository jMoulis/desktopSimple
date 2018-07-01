import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'cropperjs';
import InputFile from '../../components/Form/inputFile';
import './index.css';

class Crop extends React.Component {
  static propTypes = {
    picture: PropTypes.string.isRequired,
    closeFromParent: PropTypes.func,
    parentConfig: PropTypes.object.isRequired,
  }
  static defaultProps = {
    closeFromParent: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      cropper: null,
      picture: props.picture,
    };
    this.picRef = React.createRef();
  }

  componentDidMount() {
    this.setCropperToState();
  }
  componentDidUpdate(prevState) {
    if (prevState.picture !== this.state.picture) {
      this.state.cropper.replace(this.state.picture);
    }
  }
  setCropperToState = async () => {
    const image = this.picRef.current;
    const cropper = new Cropper(image, {
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      dragMode: 'move',
      movable: true,
      viewMode: 1,
    });
    this.setState({
      cropper,
    });
  }
  handleInputFileChange = (evt) => {
    this.readUrl(evt.target);
  }
  readUrl = (input) => {
    if (input.files && input.files[0]) {
      const { state } = this;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const newPicture = {
          ...state,
          picture: evt.target.result,
        };
        this.setState(() => (newPicture));
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  handleRotate = () => {
    if (this.state.cropper) {
      this.state.cropper.rotate(90);
    }
  }
  handleRotateBack = () => {
    if (this.state.cropper) {
      this.state.cropper.rotate(-90);
    }
  }
  handleCrop = () => {
    const { closeFromParent } = this.props;
    if (this.state.cropper.getCroppedCanvas()) {
      const imgurl = this.state.cropper.getCroppedCanvas().toDataURL();
      closeFromParent(imgurl);
    }
  }
  render() {
    const { parentConfig } = this.props;
    return (
      <div className="cropper">
        <div className="cropper-container">
          <img
            style={{
              maxWidth: '100%',
            }}
            ref={this.picRef}
            src={this.state.picture || '/img/avatar.png'}
            alt="Cropping"
          />
          <div className="crop-toolbar">
            <button type="button" className="btn btn-primary" onClick={this.handleRotateBack} title="Rotate"><i className="fas fa-undo-alt" /></button>
            <button type="button" className="btn btn-primary" onClick={this.handleRotate} title="Rotate"><i className="fas fa-redo-alt" /></button>
          </div>
          <footer>
            <button type="button" className="btn btn-success">
              <InputFile
                config={{
                  styleContainer: {
                    padding: 0,
                  },
                  styleLabelContainer: {
                    padding: 0,
                    border: 'none',
                  },
                  field: { ...parentConfig.model.picture, label: 'Change picture' },
                  onChange: this.handleInputFileChange,
                  focus: this.handleOnFocus,
                  typeFileAccepted: 'image/*',
                  error: parentConfig.error &&
                    parentConfig.error.picture &&
                    parentConfig.error.picture.detail,
                }}
              />
            </button>
            <button type="button" className="btn btn-primary" onClick={this.handleCrop}>Edit</button>
          </footer>
        </div>

      </div>
    );
  }
}

export default Crop;
