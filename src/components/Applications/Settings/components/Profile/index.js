import React from 'react';
import PropTypes from 'prop-types';
import SelectAuto from 'react-select';

import './profile.css';
import Model from '../../../../../data/models/student-model';
import Input from '../../../../Form/input';
import InputFile from '../../../../Form/inputFile';
import Select from '../../../../Form/select';
import TextArea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';

class StudentForm extends React.Component {
  static propTypes = {
    loginProcess: PropTypes.object.isRequired,
    userActive: PropTypes.object.isRequired,
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
  constructor(props) {
    super(props);
    this.state = {
      selectedCompetences: [],
    };
  }
  componentDidMount() {
    const { fetchSingleUserAction, loginProcess } = this.props;
    fetchSingleUserAction(loginProcess.loggedUser.id);
  }
  componentWillUnmount() {
    console.log('unmount');
    // Maybe do someting? Like save Datas or anything else
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
  handleInputSelectCompetencesChange = (evt) => {
    const { value } = evt.target;
    if (evt.keyCode === 13) {
      this.setState(prevState => ({
        selectedCompetences: [
          ...prevState.selectedCompetences,
          value,
        ],
      }));
      evt.target.value = '';
    }
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
            ...prevState.picture,
            value: evt.target.result,
            changed: true,
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
      selectedCompetences: {
        ...prevState.selectedCompetences,
        value: [
          ...prevState.selectedCompetences.value,
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
    const formData = document.getElementById('profile-form');
    if (this.state[name].changed) {
      editUserAction(loginProcess.loggedUser.id, formData); /* { [name]: this.state[name].value } */
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
    const { loading, error } = userActive;
    if (loading) {
      return <span />;
    }
    return (
      <div id="profile" className="form-container" key="app-content">
        <form onSubmit={this.handleSubmit} id="profile-form" className="form" noValidate="true">
          <div className="profile-content-form-wrapper">
            <div className="form-content">
              <img className="profile-picture" src={`${this.state.picture.value || '/img/avatar.png'}`} alt="Profile" />
              <InputFile
                config={{
                  field: Model.picture,
                  onChange: this.handleInputFileChange,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
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
                  field: Model.competences,
                  onChange: this.handleInputSelectCompetencesChange,
                  keyPress: this.handleInputSelectCompetencesChange,
                  type: 'text',
                  values: this.state.selectedCompetences,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.competences && error.competences.detail,
                }}
              />
              {/* <Select
                config={{
                  field: Model.competences,
                  onChange: this.handleSelectMultipleChange,
                  options: ['PHP', 'Marketing'],
                  multiple: true,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.competences && error.competences.detail,
                }}
              /> */}
              <TextArea
                config={{
                  field: Model.description,
                  onChange: this.handleInputChange,
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

export default StudentForm;
