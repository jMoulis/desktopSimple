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

class CompanyProfile extends React.Component {
  static propTypes = {
    userActive: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {};
    const { userActive } = this.props;
    const { user } = userActive; // Datas user
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: user.company ? { value: user.company[key], focus: false, changed: false } : { value: '', focus: false, changed: false } };
      return field;
    });
    this.state = {
      company: {
        ...field,
      },
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { editUserAction, userActive } = prevProps;
    // Dealing with documents
    if (prevState.company.legalDocs.value) {
      if (prevState.company.legalDocs.value.length !== this.state.company.legalDocs.value.length) {
        editUserAction(userActive.user._id, this.state);
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
      const { editUserAction, userActive } = this.props;
      const { state } = this;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const newLogo = {
          ...state,
          company: {
            ...state.company,
            logo: {
              ...state.company.logo,
              value: evt.target.result,
              changed: true,
            },
          },
        };
        this.setState(() => (newLogo));
        editUserAction(userActive.user._id, newLogo);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  handleOnBlur = (evt) => {
    // Save the input field
    const { name } = evt.target;
    const { editUserAction, userActive } = this.props;
    // const fromData = document.getElementById('profile-form')
    if (this.state.company[name].changed) {
      editUserAction(userActive.user._id, this.state);
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
    const { editUserAction, userActive } = this.props;

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
      editUserAction(userActive.user._id, newTags);
      evt.target.value = '';
    }
  }
  handleRemove = (evt) => {
    evt.preventDefault();
    const { editUserAction, userActive } = this.props;
    const { state } = this;
    const values = state.company.tags.value.filter((value, index) => (
      index !== Number(evt.target.id)
    ));
    const newTags = {
      ...state,
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
    editUserAction(userActive.user._id, newTags);
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
  render() {
    const { userActive } = this.props;
    const { loading, error } = userActive;
    const { company } = this.state;
    if (loading) {
      return <span />;
    }
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
              <img className="profile-picture" src={`${company.logo.value || '/img/avatar.png'}`} alt="Profile" />
              <InputFile
                config={{
                  field: Model.logo,
                  onChange: this.handlePictureChange,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  typeFileAccepted: 'image/*',
                  error: error && error.logo && error.logo.detail,
                }}
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
                docs={company.legalDocs.value}
                onFileChange={this.handleDocsChange}
                onBlur={this.handleOnBlur}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CompanyProfile;
