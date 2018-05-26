import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'cropperjs';
import InputFile from '../../components/Form/inputFile';
import './index.css';

class Crop extends React.Component {
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
      const image = this.picRef.current;
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
  handleCrop = () => {
    const { closeFromParent } = this.props;
    const imgurl = this.state.cropper.getCroppedCanvas().toDataURL();
    closeFromParent(imgurl);
  }
  render() {
    const { img, parentConfig } = this.props;
    return (
      <div className="cropper">
        <div className="cropper-container">
          <img
            style={{
              maxWidth: '100%',
            }}
            ref={this.picRef}
            src={this.state.picture}
            alt="Cropping"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={this.handleCrop}>Crop</button>
        <InputFile
          config={{
            field: parentConfig.model.picture,
            onChange: this.handleInputFileChange,
            focus: this.handleOnFocus,
            typeFileAccepted: 'image/*',
            error: parentConfig.error &&
              parentConfig.error.picture &&
              parentConfig.error.picture.detail,
          }}
        />
      </div>
    );
  }
}

export default Crop;
