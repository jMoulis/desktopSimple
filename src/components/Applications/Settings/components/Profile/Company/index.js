import React from 'react';
import PropTypes from 'prop-types';

import './company.css';
import Model from './company-model';
import Input from '../../../../../Form/input';
import TextArea from '../../../../../Form/textarea';
import InputAutoComplete from '../../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../../Utils/autoTextAreaResizing';
import Modal from '../../../../../../Modules/Modal/modal';
import Crop from '../../../../../../Modules/Crop';
import { ROOT_URL } from '../../../../../../Utils/config';
import DisplayDocument from '../../../../../../Modules/DisplayDocument';

class CompanyProfile extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
    clearMessageAction: PropTypes.func.isRequired,
    editUser: PropTypes.object,
  };

  static defaultProps = {
    editUser: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
    const { loggedUser } = this.props;
    let field = {};
    Object.keys(Model).map(key => {
      field = {
        ...field,
        [`company.${key}`]: loggedUser.company
          ? {
              value: loggedUser.company[key],
              focus: false,
              changed: false,
            }
          : {
              value: '',
              focus: false,
              changed: false,
            },
      };
      return field;
    });
    this.state = {
      company: {
        ...field,
      },
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.loggedUser.company.picture) {
      return {
        ...state,
        company: {
          ...state.company,
          'company.picture': {
            value: props.loggedUser.company.picture,
          },
        },
      };
    }
    return {
      ...state,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { editUserAction, loggedUser } = prevProps;
    // Dealing with documents
    if (prevState.company['company.legalDocs'].value) {
      if (
        prevState.company['company.legalDocs'].value.length !==
        this.state.company['company.legalDocs'].value.length
      ) {
        editUserAction(loggedUser._id, this.state);
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
      company: {
        ...prevState.company,
        [name]: {
          ...prevState.company[name],
          value,
          changed: true,
        },
      },
    }));
  };

  handleTextAreaChange = evt => {
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
  };

  handlePictureChange = evt => {
    this.readUrl(evt.target);
  };

  readUrl = input => {
    if (input.files && input.files[0]) {
      const { editUserAction, loggedUser } = this.props;
      const { state } = this;
      const reader = new FileReader();
      reader.onload = evt => {
        const newpicture = {
          ...state,
          company: {
            ...state.company,
            'company.picture': {
              ...state.company['company.picture'],
              value: evt.target.result,
              changed: true,
            },
          },
        };
        this.setState(() => newpicture);
        editUserAction(loggedUser._id, newpicture);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  handleOnBlur = evt => {
    // Save the input field
    const { name } = evt.target;
    const { editUserAction, loggedUser, clearMessageAction } = this.props;
    if (this.state.company[name].changed) {
      editUserAction(loggedUser._id, this.state);
    }
    clearMessageAction();
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
  };

  handleInputSelectTagsChange = evt => {
    const { value } = evt.target;
    const { editUserAction, loggedUser } = this.props;
    if (evt.keyCode === 13) {
      const { state } = this;
      const newTags = {
        ...state,
        company: {
          ...state.company,
          'company.tags': {
            ...state.company['company.tags'],
            value: [
              ...state.company['company.tags'].value,
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
  };

  handleRemove = evt => {
    evt.preventDefault();
    const { editUserAction, loggedUser } = this.props;
    const { state } = this;
    const values = state.company['company.tags'].value.filter(
      (value, index) => index !== Number(evt.target.id),
    );
    const newTags = {
      ...state,
      cropModal: false,
      company: {
        ...state.company,
        'company.tags': {
          ...state.company['company.tags'],
          value: values,
          changed: true,
        },
      },
    };
    this.setState(() => newTags);
    editUserAction(loggedUser._id, newTags);
  };

  handleDocsChange = docs => {
    const { editUserAction, loggedUser } = this.props;
    editUserAction(loggedUser._id, {
      company: { ...docs },
    });
  };

  handleRemoveFile = file => {
    const { editUserAction, loggedUser } = this.props;
    if (file) {
      editUserAction(loggedUser._id, {
        company: {
          'company.legalDocs': {
            value: file,
            changed: true,
          },
        },
      });
    }
  };

  handleShowCropImageModal = () => {
    this.setState(prevState => ({
      cropModal: !prevState.cropModal,
    }));
  };

  handleCloseCropImageModal = img => {
    // Server crashes on modal close if img undefined... Without response back
    if (img) {
      const { state } = this;
      const { editUserAction, loggedUser } = this.props;
      const newPicture = {
        ...state,
        company: {
          ...state.company,
          'company.picture': {
            ...state.company['company.picture'],
            value: img,
            changed: true,
          },
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
    const { editUser, loggedUser, editUserAction } = this.props;
    const { error, success, editing } = editUser;
    const { company } = this.state;
    return (
      <div id="profile" className="form-container" key="app-content">
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
                src={
                  company['company.picture'].value
                    ? `${ROOT_URL}${company['company.picture'].value}`
                    : '/img/company-generic.png'
                }
                alt="Profile"
                onClick={this.handleShowCropImageModal}
                onKeyPress={this.handleShowCropImageModal}
              />
              <Input
                config={{
                  field: Model.companyName,
                  onChange: this.handleInputChange,
                  value: company['company.companyName'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.companyName && error.companyName.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.street,
                  onChange: this.handleInputChange,
                  value: company['company.street'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.street && error.street.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.postalCode,
                  onChange: this.handleInputChange,
                  value: company['company.postalCode'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.postalCode && error.postalCode.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.town,
                  onChange: this.handleInputChange,
                  value: company['company.town'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.town && error.town.detail,
                  success,
                  editing,
                }}
              />
            </div>
            <div className="form-content">
              <Input
                config={{
                  field: Model.industry,
                  onChange: this.handleInputChange,
                  value: company['company.industry'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.industry && error.industry.detail,
                  success,
                  editing,
                }}
              />
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectTagsChange,
                  keyPress: this.handleInputSelectTagsChange,
                  type: 'text',
                  values: company['company.tags'].value,
                  focus: this.handleOnFocus,
                  error: error && error.tags && error.tags.detail,
                  remove: this.handleRemove,
                  success,
                  editing,
                }}
              />
              <TextArea
                config={{
                  field: Model.description,
                  onChange: this.handleTextAreaChange,
                  value: company['company.description'].value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.description && error.description.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.website,
                  onChange: this.handleInputChange,
                  value: company['company.website'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.website && error.website.detail,
                  success,
                  editing,
                }}
              />
              <Input
                config={{
                  field: Model.linkedIn,
                  onChange: this.handleInputChange,
                  value: company['company.linkedIn'].value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.linkedIn && error.linkedIn.detail,
                  success,
                  editing,
                }}
              />
              <DisplayDocument
                update={this.handleDocsChange}
                keyToUpdate="company.legalDocs"
                documents={loggedUser.company.legalDocs}
                onDelete={this.handleRemoveFile}
              />
            </div>
          </div>
        </form>
        {this.state.cropModal && (
          <Modal
            zIndex={100}
            name="imageCropper"
            title="Image Cropper"
            closeFromParent={this.handleCloseCropImageModal}
          >
            <Crop
              picture={
                company['company.picture'].value
                  ? `${ROOT_URL}${company['company.picture'].value}`
                  : '/img/company-generic.png'
              }
              parentConfig={{
                user: loggedUser,
                update: editUserAction,
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

export default CompanyProfile;
