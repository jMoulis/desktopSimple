import React from 'react';
import PropTypes from 'prop-types';

import './profile.css';
import Model from './student-model';
import Input from '../../../../Form/input';
import InputFile from '../../../../Form/inputFile';
import Select from '../../../../Form/select';
import TextArea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';

class Profile extends React.Component {
  static propTypes = {
    userActive: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const { userActive } = this.props;
    const { user } = userActive; // Datas user
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: user ? { value: user[key], focus: false, changed: false } : { value: '', focus: false, changed: false } };
      return field;
    });
    this.state = {
      ...field,
    };
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
  handleInputSelectCompetencesChange = (evt) => {
    const { value } = evt.target;
    const { editUserAction, userActive } = this.props;

    if (evt.keyCode === 13 || evt.keyCode === 32 || evt.keyCode === 188) {
      const { state } = this;
      const newTags = {
        ...state,
        tags: {
          ...state.tags,
          value: [
            ...state.tags.value,
            value.toLowerCase(),
          ],
          changed: true,
        },
      };
      this.setState(() => newTags);
      editUserAction(userActive.user._id, newTags);
      evt.target.value = '';
    }
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
        const newPicture = {
          ...state,
          picture: {
            ...state.picture,
            value: evt.target.result,
            changed: true,
          },
        };
        this.setState(() => (newPicture));
        editUserAction(userActive.user._id, newPicture);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  handleSelectChange = (evt) => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
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
  handleOnFocus = (evt) => {
    // Save the input field
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        focus: true,
      },
    }));
  }
  handleRemove = (evt) => {
    evt.preventDefault();
    const { editUserAction, userActive } = this.props;
    const { state } = this;
    const values = state.tags.value.filter((value, index) => (
      index !== Number(evt.target.id)
    ));
    const newtags = {
      ...state,
      tags: {
        ...state.tags,
        value: values,
        changed: true,
      },
    };
    this.setState(() => newtags);
    editUserAction(userActive.user._id, newtags);
  }
  render() {
    const { userActive } = this.props;
    const { error } = userActive;
    return (
      <div id="profile" className="form-container" key="app-content" >
        <form
          id="profile-form"
          className="form"
          noValidate="true"
          onKeyPress={this.handleFormKeyPress}
        >
          <div className="form-content-wrapper">
            <div className="form-content">
              <img className="profile-picture" src={`${this.state.picture.value || '/img/avatar.png'}`} alt="Profile" />
              <InputFile
                config={{
                  field: Model.picture,
                  onChange: this.handleInputFileChange,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  typeFileAccepted: 'image/*',
                  error: error && error.picture && error.picture.detail,
                }}
              />
              <Input
                config={{
                  field: Model.fullName,
                  onChange: this.handleInputChange,
                  value: this.state.fullName.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.fullName && error.fullName.detail,
                }}
              />
              <Input
                config={{
                  field: Model.email,
                  onChange: this.handleInputChange,
                  value: this.state.email.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.email && error.email.detail,
                }}
              />
              <Input
                config={{
                  field: Model.location,
                  onChange: this.handleInputChange,
                  value: this.state.location.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.location && error.location.detail,
                }}
              />
              <Select
                config={{
                  field: Model.school,
                  onChange: this.handleSelectChange,
                  value: this.state.school.value,
                  options: ['Bem', 'O\'Clock'],
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.school && error.school.detail,
                }}
              />
            </div>
            <div className="form-content">
              <Select
                config={{
                  field: Model.diploma,
                  onChange: this.handleSelectChange,
                  value: this.state.diploma.value,
                  options: ['Master', 'Bachelor'],
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.diploma && error.diploma.detail,
                }}
              />
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectCompetencesChange,
                  keyPress: this.handleInputSelectCompetencesChange,
                  values: this.state.tags.value,
                  focus: this.handleOnFocus,
                  blur: this.handleOnBlur,
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
              <Input
                config={{
                  field: Model.gitHub,
                  onChange: this.handleInputChange,
                  value: this.state.gitHub.value,
                  type: 'text',
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.gitHub && error.gitHub.detail,
                }}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Profile;
