import React from 'react';
import PropTypes from 'prop-types';

import './profile.css';
import Model from '../../../../../data/models/student-model';
import Input from '../../../../Form/input';
import InputFile from '../../../../Form/inputFile';
import Select from '../../../../Form/select';
import TextArea from '../../../../Form/textarea';

class StudentForm extends React.Component {
  static propTypes = {
    loginProcess: PropTypes.object.isRequired,
    editUserAction: PropTypes.func.isRequired,
    fetchSingleUserAction: PropTypes.func.isRequired,
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
  state = {};
  componentDidMount() {
    const { fetchSingleUserAction, loginProcess } = this.props;
    fetchSingleUserAction(loginProcess.loggedUser.id);
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { editUserAction, loginProcess } = this.props;
    editUserAction(loginProcess.loggedUser.id, evt.target);
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
  handleInputFileChange = (evt) => {
    this.readUrl(evt.target);
  }
  readUrl = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState(prevState => ({
          ...prevState,
          picture: {
            value: evt.target.result,
          },
        }));
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
  handleSelectMultipleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: [
          ...prevState[name].value,
          value,
        ],
        changed: true,
      },
    }));
  }
  handleOnBlur = (evt) => {
    // Save the input field
    const { name } = evt.target;
    const { editUserAction, loginProcess } = this.props;
    if (this.state[name].changed) {
      editUserAction(loginProcess.loggedUser.id, { [name]: this.state[name].value });
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
  render() {
    const { userActive } = this.props;
    const { user, loading, error} = userActive;
    if (loading) {
      return <span>'Loading'</span>;
    }
    return (
      [
        <div className="app-toolbar" key="app-toolbar">
          <ul>
            <li>Profile</li>
            <li>Profile</li>
            <li>Profile</li>
          </ul>
        </div>,
        <div id="profile" className="form-container" key="app-content">
          <form onSubmit={this.handleSubmit} id="profile-form" className="form" noValidate="true">
            <div className="profile-content-form-wrapper">
              <div className="form-content">
                <img className="profile-picture" src={`${this.state.picture.value || '/img/avatar.png'}`} alt="Profile" />
                <InputFile
                  config={{
                    field: Model.picture,
                    onChange: this.handleInputFileChange,
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
                    // error: error && error.typeUser && error.typeUser.detail,
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
                  }}
                />
                <div>
                  <ul className="ul-unstyled">
                    {this.state.competences.value.length >= 0 &&
                      this.state.competences.value.map((competence, index) => (
                        <li key={index}><span>{competence}</span>X</li>
                      ))}
                  </ul>
                </div>
                <Select
                  config={{
                    field: Model.competences,
                    onChange: this.handleSelectMultipleChange,
                    options: ['PHP', 'Marketing'],
                    multiple: true,
                    blur: this.handleOnBlur,
                    focus: this.handleOnFocus,
                  }}
                />
                <TextArea
                  config={{
                    field: Model.description,
                    onChange: this.handleInputChange,
                    value: this.state.description.value,
                    blur: this.handleOnBlur,
                    focus: this.handleOnFocus,
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
                  }}
                />
              </div>
            </div>
          </form>
        </div>,
      ]
    );
  }
}

export default StudentForm;
