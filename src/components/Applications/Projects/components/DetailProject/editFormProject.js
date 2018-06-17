import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './index.css';
import Model from '../Model/project-model';
import Input from '../../../../Form/input';
import Textarea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import Checkbox from '../../../../Form/checkbox';
import AddFilesInput from '../../../../../Modules/filesHandler/addFilesInput';
import UserIcon from '../../../../../Modules/UserIcon';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';

class EditFormProject extends Component {
  static propTypes = {
    activeProjectProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    editProjectAction: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const { activeProjectProcess } = props;
    const { project } = activeProjectProcess;
    let field = {};
    Object.keys(Model).map((key) => {
      field = {
        ...field,
        [key]: project ?
          { value: project[key], focus: false, changed: false } :
          { value: Model[key].isArray ? [] : '', focus: false, changed: false },
      };
      return field;
    });
    this.state = {
      form: {
        ...field,
        dueDate: project.dueDate ?
          { value: moment(project.dueDate).format('DD/MM/YYYY'), changed: false } :
          { value: '', focus: false, changed: false },
      },
      author: project.author,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { editProjectAction } = prevProps;
    // Dealing with documents
    if (prevState.form.docs.value) {
      if (prevState.form.docs.value.length !== this.state.form.docs.value.length) {
        editProjectAction(this.state.form);
      }
    }
  }
  handleInputChange = (evt) => {
    const { value, name } = evt.target;
    return this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: {
          ...prevState.form[name],
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
      form: {
        ...prevState.form,
        [name]: {
          ...prevState.form[name],
          value,
          changed: true,
        },
      },
    }));
  }
  handleCheckBoxChange = (evt) => {
    const { name, checked } = evt.target;

    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: {
          ...prevState.form[name],
          value: checked,
          changed: true,
        },
      },
    }));
  }
  handleFormKeyPress = (evt) => {
    if (evt.key === 'Enter' && evt.target.type !== 'textarea' && evt.target.type !== 'submit') {
      evt.preventDefault();
      return false;
    }
    return true;
  }
  handleInputSelectTagsChange = (evt) => {
    const inputValue = evt.target.value;
    const { editProjectAction } = this.props;
    if (evt.keyCode === 13) {
      const { state } = this;
      const newTags = {
        ...state,
        form: {
          ...state.form,
          tags: {
            ...state.form.tags,
            value: [
              ...state.form.tags.value,
              inputValue,
            ],
            changed: true,
          },
        },
      };
      this.setState(prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          tags: {
            ...state.form.tags,
            value: [
              ...state.form.tags.value,
              inputValue,
            ],
            changed: true,
          },
        },
      }));
      editProjectAction(newTags);
      evt.target.value = '';
    }
  }
  handleOnBlur = (evt) => {
    // Save the input field
    const { name } = evt.target;
    const { editProjectAction } = this.props;
    if (this.state.form[name].changed) {
      editProjectAction(this.state.form);
    }
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: {
          ...prevState.form[name],
          focus: false,
          changed: false,
        },
      },
    }));
  }
  handleOnFocus = (evt) => {
    // Save the input field
    if (evt) {
      const { name } = evt.target;
      this.setState(prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          [name]: {
            ...prevState.form[name],
            focus: true,
          },
        },
      }));
    }
  }
  handleInputFileChange = (docs) => {
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        docs: {
          value: docs,
          changed: true,
        },
      },
    }));
  }
  handleRemove = (evt) => {
    evt.preventDefault();
    const { editProjectAction } = this.props;
    const { state } = this;
    const values = state.form.tags.value.filter((value, index) => (
      index !== Number(evt.target.id)
    ));
    const newTags = {
      ...state,
      form: {
        ...state.form,
        tags: {
          ...state.form.tags,
          value: values,
          changed: true,
        },
      },
    };
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        tags: {
          ...state.form.tags,
          value: values,
          changed: true,
        },
      },
    }));
    editProjectAction(newTags);
  }
  render() {
    const {
      activeProjectProcess,
      loggedUser,
    } = this.props;
    const { author } = this.state;
    const { error, project } = activeProjectProcess;
    const user = loggedUser;
    return (
      <form
        id="edit-project-form"
        className="form"
        onKeyPress={this.handleFormKeyPress}
        noValidate="true"
      >
        <div className="form-content">
          <div className="company">
            <img className="company-logo" src={author.company.picture || '/img/anonymous.png'} alt="logo company" />
            <div className="company-info">
              <p className="company-info-name">{author.company.companyName}</p>
              <div className="company-author">
                <UserIcon
                  user={{ user: author }}
                  classCss="middle"
                />
                <p>{author.fullName}</p>
              </div>
            </div>
          </div>
          <Input
            config={{
              field: Model.title,
              onChange: this.handleInputChange,
              value: this.state.form.title.value,
              blur: this.handleOnBlur,
              keyPress: this.handleInputChange,
              readOnly: project.author._id !== user._id,
              focus: this.handleOnFocus,
              isFocused: this.state.form.title.focus,
              error: error && error.title && error.title.detail,
            }}
          />
          <Textarea
            config={{
              field: Model.description,
              onChange: this.handleTextAreaChange,
              value: this.state.form.description.value,
              blur: this.handleOnBlur,
              readOnly: project.author._id !== user._id,
              focus: this.handleOnFocus,
              isFocused: this.state.form.description.focus,
              error: error && error.description && error.description.detail,
            }}
          />
          <Input
            config={{
              field: Model.dueDate,
              onChange: this.handleInputChange,
              value: this.state.form.dueDate.value,
              blur: this.handleOnBlur,
              keyPress: this.handleInputChange,
              readOnly: project.author._id !== user._id,
              focus: this.handleOnFocus,
              isFocused: this.state.form.dueDate.focus,
              error: error && error.dueDate && error.dueDate.detail,
            }}
          />
          <Checkbox
            config={{
              field: Model.isPrice,
              onChange: this.handleCheckBoxChange,
              value: this.state.form.isPrice.value,
              blur: this.handleOnBlur,
              readOnly: project.author._id !== user._id,
              focus: this.handleOnFocus,
              isFocused: this.state.form.isPrice.focus,
              error: error && error.isPrice && error.isPrice.detail,
            }}
          />
          {this.state.form.isPrice.value &&
            <Input
              config={{
                field: Model.price,
                onChange: this.handleInputChange,
                value: this.state.form.price.value,
                blur: this.handleOnBlur,
                focus: this.handleOnFocus,
                keyPress: this.handleInputChange,
                readOnly: project.author._id !== user._id,
                isFocused: this.state.form.price.focus,
                error: error && error.price && error.price.detail,
              }}
            />
          }
          <Checkbox
            config={{
              field: Model.isContest,
              onChange: this.handleCheckBoxChange,
              value: this.state.form.isContest.value,
              blur: this.handleOnBlur,
              readOnly: project.author._id !== user._id,
              focus: this.handleOnFocus,
              isFocused: this.state.form.isContest.focus,
              error: error && error.isContest && error.isContest.detail,
            }}
          />
          {this.state.form.isContest.value &&
            <Input
              config={{
                field: Model.maxTeam,
                max: 4,
                min: project.teams.length !== 0 ? project.teams.length : 1,
                onChange: this.handleInputChange,
                value: this.state.form.maxTeam.value,
                blur: this.handleOnBlur,
                focus: this.handleOnFocus,
                keyPress: this.handleInputChange,
                readOnly: project.author._id !== user._id,
                isFocused: this.state.form.maxTeam.focus,
                error: error && error.maxTeam && error.maxTeam.detail,
              }}
            />
          }
          <InputAutoComplete
            config={{
              field: Model.tags,
              onChange: this.handleInputSelectTagsChange,
              keyPress: this.handleInputSelectTagsChange,
              values: this.state.form.tags.value,
              blur: this.handleOnBlur,
              readOnly: project.author._id !== user._id,
              error: error && error.tags && error.tags.detail,
              focus: this.handleOnFocus,
              isFocused: this.state.form.tags.focus,
              remove: this.handleRemove,
            }}
          />
          <AddFilesInput
            error={error && error.docs && error.docs.detail}
            docs={this.state.form.docs.value}
            onFileChange={this.handleInputFileChange}
            blur={this.handleOnBlur}
            readOnly={project.author._id !== user._id}
          />
        </div>
    </form>
    );
  }
}

export default EditFormProject;