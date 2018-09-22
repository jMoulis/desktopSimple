import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';

import './profile.css';
import '../../../../../../node_modules/cropperjs/dist/cropper.css';
import Model from './student-model';
import Input from '../../../../Form/input';
import TextArea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';
import Modal from '../../../../../Modules/Modal/modal';
import Crop from '../../../../../Modules/Crop';
import { ROOT_URL } from '../../../../../Utils/config';
import DisplayDocument from '../../../../../Modules/DisplayDocument';

class Profile extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
    editUser: PropTypes.object.isRequired,
    clearMessageAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { loggedUser } = this.props;
    let field = {};
    Object.keys(Model).map(key => {
      field = {
        ...field,
        [key]: loggedUser
          ? { value: loggedUser[key], focus: false, changed: false }
          : { value: '', focus: false, changed: false },
      };
      return field;
    });
    this.state = {
      ...field,
      cropModal: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.loggedUser.picture) {
      return {
        ...state,
        picture: {
          ...state.picture,
          value: props.loggedUser.picture,
        },
      };
    }
    return {
      ...state,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { editUserAction, loggedUser, clearMessageAction } = prevProps;
    // Dealing with documents
    if (prevState.files.value) {
      if (prevState.files.value.length !== this.state.files.value.length) {
        editUserAction(loggedUser._id, this.state);
        clearMessageAction();
      }
    }
  }

  componentWillUnmount() {
    const { clearMessageAction } = this.props;
    clearMessageAction();
  }

  handleFormKeyPress = evt => {
    if (
      evt.key === 'Enter' &&
      evt.target.type !== 'textarea' &&
      evt.target.type !== 'submit'
    ) {
      evt.preventDefault();
      return false;
    }
    return true;
  };

  handleInputChange = evt => {
    const { value, name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  };

  handleTextAreaChange = evt => {
    const { value, name } = evt.target;
    autoTextAreaResizing(evt.target);
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  };

  handleInputSelectCompetencesChange = evt => {
    const { value } = evt.target;
    const { editUserAction, loggedUser } = this.props;
    if (evt.keyCode === 13) {
      this.setState(
        prevState => ({
          ...prevState,
          tags: {
            ...prevState.tags,
            value: [...prevState.tags.value, value],
            changed: true,
          },
        }),
        () => editUserAction(loggedUser._id, this.state),
      );
      evt.target.value = '';
    }
  };

  handleInputFileChange = evt => {
    this.readUrl(evt.target);
  };

  readUrl = input => {
    if (input.files && input.files[0]) {
      const { editUserAction, loggedUser } = this.props;
      const { state } = this;
      const reader = new FileReader();
      reader.onload = evt => {
        const newPicture = {
          ...state,
          picture: {
            ...state.picture,
            value: evt.target.result,
            changed: true,
          },
        };
        this.setState(() => newPicture);
        editUserAction(loggedUser._id, newPicture);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  handleSelectChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  };

  handleOnBlur = evt => {
    // Save the input field
    const { name } = evt.target;
    const { editUserAction, loggedUser, clearMessageAction } = this.props;
    if (this.state[name].changed) {
      editUserAction(loggedUser._id, this.state);
    }
    clearMessageAction();
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        focus: false,
        changed: false,
      },
    }));
  };

  handleOnFocus = evt => {
    // Save the input field
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        changed: false,
        focus: true,
      },
    }));
  };

  handleRemove = evt => {
    evt.preventDefault();
    const { editUserAction, loggedUser } = this.props;
    const { state } = this;
    const values = state.tags.value.filter(
      (value, index) => index !== Number(evt.target.id),
    );
    const newtags = {
      ...state,
      tags: {
        ...state.tags,
        value: values,
        changed: true,
      },
    };
    this.setState(() => newtags);
    editUserAction(loggedUser._id, newtags);
  };

  handleFilesChange = files => {
    const { editUserAction, loggedUser } = this.props;
    editUserAction(loggedUser._id, files);
  };

  handleShowCropImageModal = () => {
    this.setState(prevState => ({
      cropModal: !prevState.cropModal,
    }));
  };

  handleRemoveFile = file => {
    const { editUserAction, loggedUser } = this.props;
    if (file) {
      editUserAction(loggedUser._id, {
        files: {
          value: file,
          changed: true,
        },
      });
    }
  };

  handleCloseCropImageModal = img => {
    // Server crashes on modal close if img undefined... Without response back
    if (img) {
      const { state } = this;
      const { editUserAction, loggedUser } = this.props;
      const newPicture = {
        ...state,
        picture: {
          ...state.picture,
          value: img,
          changed: true,
        },
        cropModal: false,
      };
      this.setState(() => newPicture);
      editUserAction(loggedUser._id, newPicture);
    } else {
      this.setState(prevState => ({
        ...prevState,
        cropModal: false,
      }));
    }
  };

  render() {
    const { editUser, loggedUser } = this.props;
    const { error, success, editing } = editUser;
    const {
      picture,
      fullName,
      email,
      jobDescription,
      location,
      school,
      diploma,
      field,
      tags,
      description,
      website,
      linkedIn,
      gitHub,
      cropModal,
    } = this.state;
    return (
      <div id="profile" className="form-container" key="app-content">
        <form
          id="profile-form"
          className="form"
          noValidate="true"
          onKeyPress={this.handleFormKeyPress}
        >
          <div className="form-content-wrapper">
            <div className="form-content">
              <img
                className="profile-picture"
                src={
                  picture.value
                    ? `${ROOT_URL}${picture.value}`
                    : '/img/avatar.png'
                }
                alt="Profile"
                onClick={this.handleShowCropImageModal}
                onKeyPress={this.handleShowCropImageModal}
              />
              <ul className="date-since-container">
                <li>
                  <span className="date-since-item">
                    {`Member since: ${Moment(loggedUser.createdAt).format(
                      'DD/MM/YYYY',
                    )}`}
                  </span>
                </li>
                <li>
                  <span className="date-since-item">
                    {`Last update: ${Moment(loggedUser.updatedAt).format(
                      'DD/MM/YYYY',
                    )}`}
                  </span>
                </li>
              </ul>
              <Input
                config={{
                  field: Model.fullName,
                  onChange: this.handleInputChange,
                  value: fullName.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.fullName && error.fullName.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.email,
                  onChange: this.handleInputChange,
                  value: email.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.email && error.email.detail,
                  success,
                  editing,
                }}
              />
              {loggedUser.typeUser === 'company' && (
                <Input
                  config={{
                    field: Model.jobDescription,
                    onChange: this.handleInputChange,
                    value: jobDescription.value,
                    type: 'text',
                    blur: this.handleOnBlur,
                    focus: this.handleOnFocus,
                    error:
                      error &&
                      error.jobDescription &&
                      error.jobDescription.detail,
                    success,
                    editing,
                  }}
                />
              )}
              <Input
                config={{
                  field: Model.location,
                  onChange: this.handleInputChange,
                  value: location.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.location && error.location.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.school,
                  onChange: this.handleInputChange,
                  value: school.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.school && error.school.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.diploma,
                  onChange: this.handleInputChange,
                  value: diploma.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.diploma && error.diploma.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.field,
                  onChange: this.handleInputChange,
                  value: field.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.field && error.field.detail,
                  success,
                  editing,
                }}
              />
            </div>
            <div className="form-content">
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectCompetencesChange,
                  keyPress: this.handleInputSelectCompetencesChange,
                  values: tags.value,
                  focus: this.handleOnFocus,
                  error: error && error.tags && error.tags.detail,
                  remove: this.handleRemove,
                  success,
                }}
              />
              <TextArea
                config={{
                  field: Model.description,
                  onChange: this.handleTextAreaChange,
                  value: description.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.description && error.description.detail,
                  success,
                }}
              />
              <Input
                config={{
                  field: Model.website,
                  onChange: this.handleInputChange,
                  value: website.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.website && error.website.detail,
                  success,
                }}
              />
              <Input
                config={{
                  field: Model.linkedIn,
                  onChange: this.handleInputChange,
                  value: linkedIn.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.linkedIn && error.linkedIn.detail,
                  success,
                }}
              />
              <Input
                config={{
                  field: Model.gitHub,
                  onChange: this.handleInputChange,
                  value: gitHub.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.gitHub && error.gitHub.detail,
                  success,
                }}
              />
              <DisplayDocument
                update={this.handleFilesChange}
                keyToUpdate="files"
                files={loggedUser.files}
                onDelete={this.handleRemoveFile}
                editable
              />
            </div>
          </div>
        </form>
        {cropModal && (
          <Modal
            zIndex={100}
            name="imageCropper"
            title="Image Cropper"
            closeFromParent={this.handleCloseCropImageModal}
            noParamsOnClose
          >
            <Crop
              picture={picture.value && `${ROOT_URL}${picture.value}`}
              parentConfig={{
                user: loggedUser,
                error,
                model: Model,
              }}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default Profile;
