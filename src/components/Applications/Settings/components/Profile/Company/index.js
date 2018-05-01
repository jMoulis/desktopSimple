import React from 'react';
import PropTypes from 'prop-types';

import './company.css';
import Model from './company-model';
import Input from '../../../../../Form/input';
import InputFile from '../../../../../Form/inputFile';
import TextArea from '../../../../../Form/textarea';
import InputAutoComplete from '../../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../../Utils/autoTextAreaResizing';

class CompanyProfile extends React.Component {
  static propTypes = {
    userActive: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
  }
  static getDerivedStateFromProps(nextProps) {
    const { userActive } = nextProps;
    const { user } = userActive; // Datas user
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: user ? { value: user[key], focus: false, changed: false } : { value: '', focus: false, changed: false } };
      return field;
    });
    return {
      ...field,
    };
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {
    console.log('unmount');
    // Maybe do someting? Like save Datas or anything else
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
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  }
  handleTextAreaChange = (evt) => {
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
  }
  handleInputFileChange = (evt) => {
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
          logo: {
            ...state.logo,
            value: evt.target.result,
            changed: true,
          },
        };
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
    if (this.state[name].changed) {
      editUserAction(userActive.user._id, this.state);
    }
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        focus: false,
        changed: false,
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
        tags: {
          ...state.tags,
          value: [
            ...state.tags.value,
            value,
          ],
          changed: true,
        },
      };
      editUserAction(userActive.user._id, newTags);
      evt.target.value = '';
    }
  }
  handleRemove = (evt) => {
    evt.preventDefault();
    const { editUserAction, userActive } = this.props;
    const { state } = this;
    const values = state.tags.value.filter((value, index) => (
      index !== Number(evt.target.id)
    ));
    const newTags = {
      ...state,
      tags: {
        ...state.tags,
        value: values,
        changed: true,
      },
    };
    editUserAction(userActive.user._id, newTags);
  }
  render() {
    const { userActive } = this.props;
    const { loading, error } = userActive;
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
              <img className="profile-picture" src={`${this.state.logo.value || '/img/avatar.png'}`} alt="Profile" />
              <InputFile
                config={{
                  field: Model.logo,
                  onChange: this.handleInputFileChange,
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
                  value: this.state.companyName.value,
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
                  value: this.state.street.value,
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
                  value: this.state.postalCode.value,
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
                  value: this.state.town.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.town && error.town.detail,
                }}
              />
              <Input
                config={{
                  field: Model.industry,
                  onChange: this.handleInputChange,
                  value: this.state.industry.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.industry && error.industry.detail,
                }}
              />
            </div>
            <div className="form-content">
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectTagsChange,
                  keyPress: this.handleInputSelectTagsChange,
                  type: 'text',
                  values: this.state.tags.value,
                  focus: this.handleOnFocus,
                  error: error && error.tags && error.tags.detail,
                  remove: this.handleRemove,
                }}
              />
              <TextArea
                config={{
                  field: Model.description,
                  onChange: this.handleTextAreaChange,
                  value: this.state.description.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.description && error.description.detail,
                }}
              />
              <Input
                config={{
                  field: Model.website,
                  onChange: this.handleInputChange,
                  value: this.state.website.value,
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
                  value: this.state.linkedIn.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.linkedIn && error.linkedIn.detail,
                }}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CompanyProfile;
