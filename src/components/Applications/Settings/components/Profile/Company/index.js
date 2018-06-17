import React from 'react';
import PropTypes from 'prop-types';

import './company.css';
import Model from './company-model';
import Input from '../../../../../Form/input';
import InputFile from '../../../../../Form/inputFile';
import TextArea from '../../../../../Form/textarea';
import InputAutoComplete from '../../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../../Utils/autoTextAreaResizing';
import AddFilesInput from '../../../../../../Modules/filesHandler/addFilesInput';
import Modal from '../../../../Projects/components/Modal/modal';
import Crop from '../../../../../../Modules/Crop';

class CompanyProfile extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {};
    const { loggedUser } = this.props;
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: loggedUser.company ? { value: loggedUser.company[key], focus: false, changed: false } : { value: '', focus: false, changed: false } };
      return field;
    });
    this.state = {
      company: {
        ...field,
      },
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { editUserAction, loggedUser } = prevProps;
    // Dealing with documents
    if (prevState.company.legalDocs.value) {
      if (prevState.company.legalDocs.value.length !== this.state.company.legalDocs.value.length) {
        editUserAction(loggedUser._id, this.state);
      }
    }
  }
  handleFormKeyPress = (evt) => {
    if (evt.key === 'Enter' && evt.target.type !== 'textarea' && evt.target.type !== 'submit') {
      evt.preventDefault();
      return false;
    }
    return true;
  }
  handleInputChange = (evt) => {
    const { value, name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      company: {
        ...prevState.company,
        [name]: {
          ...prevState.company[name],
          value,
          changed: true,
        },
      },
    }));
  }
  handleTextAreaChange = (evt) => {
    const { value, name } = evt.target;
    autoTextAreaResizing(evt.target);
    this.setState(prevState => ({
      ...prevState,
      company: {
        ...prevState.company,
        [name]: {
          ...prevState.company[name],
          value,
          changed: true,
        },
      },
    }));
  }
  handlePictureChange = (evt) => {
    this.readUrl(evt.target);
  }
  readUrl = (input) => {
    if (input.files && input.files[0]) {
      const { editUserAction, loggedUser } = this.props;
      const { state } = this;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const newpicture = {
          ...state,
          company: {
            ...state.company,
            picture: {
              ...state.company.picture,
              value: evt.target.result,
              changed: true,
            },
          },
        };
        this.setState(() => (newpicture));
        editUserAction(loggedUser._id, newpicture);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  handleOnBlur = (evt) => {
    // Save the input field
    const { name } = evt.target;
    const { editUserAction, loggedUser } = this.props;
    // const fromData = document.getElementById('profile-form')
    if (this.state.company[name].changed) {
      editUserAction(loggedUser._id, this.state);
    }
    this.setState(prevState => ({
      ...prevState,
      company: {
        ...prevState.company,
        [name]: {
          ...prevState.company[name],
          focus: false,
          changed: false,
        },
      },
    }));
  }
  handleInputSelectTagsChange = (evt) => {
    const { value } = evt.target;
    const { editUserAction, loggedUser } = this.props;
    if (evt.keyCode === 13) {
      const { state } = this;
      const newTags = {
        ...state,
        company: {
          ...state.company,
          tags: {
            ...state.company.tags,
            value: [
              ...state.company.tags.value,
              value.toLowerCase(),
            ],
            changed: true,
          },
        },
      };
      this.setState(() => newTags);
      editUserAction(loggedUser._id, newTags);
      evt.target.value = '';
    }
  }
  handleRemove = (evt) => {
    evt.preventDefault();
    const { editUserAction, loggedUser } = this.props;
    const { state } = this;
    const values = state.company.tags.value.filter((value, index) => (
      index !== Number(evt.target.id)
    ));
    const newTags = {
      ...state,
      cropModal: false,
      company: {
        ...state.company,
        tags: {
          ...state.company.tags,
          value: values,
          changed: true,
        },
      },
    };
    this.setState(() => newTags);
    editUserAction(loggedUser._id, newTags);
  }
  handleDocsChange = (docs) => {
    this.setState(prevState => ({
      ...prevState,
      company: {
        ...prevState.company,
        legalDocs: {
          value: docs,
          changed: true,
        },
      },
    }));
  }
  handleShowCropImageModal = () => {
    this.setState(prevState => ({
      cropModal: !prevState.cropModal,
    }));
  }
  handleCloseCropImageModal = (img) => {
    // Server crashes on modal close if img undefined... Without response back
    if (img) {
      const { state } = this;
      const { editUserAction, loggedUser } = this.props;
      const newPicture = {
        ...state,
        company: {
          ...state.company,
          picture: {
            ...state.picture,
            value: img,
            changed: true,
          },
        },
        cropModal: false,
      };
      this.setState(() => (newPicture));
      editUserAction(loggedUser._id, newPicture);
    }
    else {
      this.setState(prevState => ({
        ...prevState,
        cropModal: false,
      }));
    }
  }
  render() {
    const { editUser, loggedUser, editUserAction } = this.props;
    const { error } = editUser;
    const { company } = this.state;
    return (
      <div id="profile" className="form-container" key="app-content" >
        <form
          id="profile-form"
          className="form"
          noValidate="true"
          onKeyPress={this.handleFormKeyPress}
        >
          <div className="profile-content-form-wrapper">
            <div className="form-content">
              <img
                className="profile-picture"
                src={`${company.picture.value || '/img/avatar.png'}`}
                alt="Profile"
                onClick={this.handleShowCropImageModal}
                onKeyPress={this.handleShowCropImageModal}
              />
              <Input
                config={{
                  field: Model.companyName,
                  onChange: this.handleInputChange,
                  value: company.companyName.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.companyName && error.companyName.detail,
                }}
              />
              <Input
                config={{
                  field: Model.street,
                  onChange: this.handleInputChange,
                  value: company.street.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.street && error.street.detail,
                }}
              />
              <Input
                config={{
                  field: Model.postalCode,
                  onChange: this.handleInputChange,
                  value: company.postalCode.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.postalCode && error.postalCode.detail,
                }}
              />
              <Input
                config={{
                  field: Model.town,
                  onChange: this.handleInputChange,
                  value: company.town.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.town && error.town.detail,
                }}
              />
            </div>
            <div className="form-content">
              <Input
                config={{
                  field: Model.industry,
                  onChange: this.handleInputChange,
                  value: company.industry.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.industry && error.industry.detail,
                }}
              />
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectTagsChange,
                  keyPress: this.handleInputSelectTagsChange,
                  type: 'text',
                  values: company.tags.value,
                  focus: this.handleOnFocus,
                  error: error && error.tags && error.tags.detail,
                  remove: this.handleRemove,
                }}
              />
              <TextArea
                config={{
                  field: Model.description,
                  onChange: this.handleTextAreaChange,
                  value: company.description.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.description && error.description.detail,
                }}
              />
              <Input
                config={{
                  field: Model.website,
                  onChange: this.handleInputChange,
                  value: company.website.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.website && error.website.detail,
                }}
              />
              <Input
                config={{
                  field: Model.linkedIn,
                  onChange: this.handleInputChange,
                  value: company.linkedIn.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.linkedIn && error.linkedIn.detail,
                }}
              />
              <AddFilesInput
                error={error && error.legalDocs && error.legalDocs.detail}
                docs={company.legalDocs.value || []}
                onFileChange={this.handleDocsChange}
                onBlur={this.handleOnBlur}
              />
            </div>
          </div>
        </form>
        {this.state.cropModal &&
          <Modal
            zIndex={100}
            name="imageCropper"
            title="Image Cropper"
            closeFromParent={this.handleCloseCropImageModal}
          >
            <Crop
              picture={company.picture.value}
              parentConfig={{
                user: loggedUser,
                update: editUserAction,
                error,
                model: Model,
              }}
            />
          </Modal>}
      </div>
    );
  }
}

export default CompanyProfile;
