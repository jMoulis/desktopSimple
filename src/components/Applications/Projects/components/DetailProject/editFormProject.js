import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './editProjectForm.css';
import Model from '../Model/project-model';
import Input from '../../../../Form/input';
import Textarea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import Checkbox from '../../../../Form/checkbox';
import DisplayDocument from '../../../../../Modules/DisplayDocument';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';
import CompanyHeader from '../../../../../Modules/CompanyHeader';

class EditFormProject extends Component {
  static propTypes = {
    activeProjectProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    editProjectAction: PropTypes.func.isRequired,
    clearProjectMessageAction: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    const { activeProjectProcess } = props;
    const { project } = activeProjectProcess;
    let field = {};
    Object.keys(Model).map(key => {
      field = {
        ...field,
        [key]: project
          ? { value: project[key], focus: false, changed: false }
          : {
              value: Model[key].isArray ? [] : '',
              focus: false,
              changed: false,
            },
      };
      return field;
    });
    this.state = {
      form: {
        ...field,
        dueDate: project.dueDate
          ? {
              value: moment(project.dueDate).format('DD/MM/YYYY'),
              changed: false,
            }
          : { value: '', focus: false, changed: false },
      },
      author: project.author,
    };
  }

  handleInputChange = evt => {
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
  };
  handleTextAreaChange = evt => {
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
  };
  handleCheckBoxChange = evt => {
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
  };
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
  handleInputSelectTagsChange = evt => {
    const inputValue = evt.target.value;
    const { editProjectAction } = this.props;
    if (evt.keyCode === 13) {
      const { state } = this;
      this.setState(
        prevState => ({
          ...prevState,
          form: {
            ...prevState.form,
            tags: {
              ...state.form.tags,
              value: [...state.form.tags.value, inputValue],
              changed: true,
            },
          },
        }),
        () => editProjectAction(this.state.form),
      );

      evt.target.value = '';
    }
  };
  handleOnBlur = evt => {
    // Save the input field
    const { name } = evt.target;
    const { editProjectAction, clearProjectMessageAction } = this.props;
    if (this.state.form[name].changed) {
      editProjectAction(this.state.form);
    }
    clearProjectMessageAction();
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
  };
  handleOnFocus = evt => {
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
  };
  handleInputFileChange = files => {
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        files: {
          value: files,
          changed: true,
        },
      },
    }));
  };
  handleRemove = evt => {
    evt.preventDefault();
    const { editProjectAction } = this.props;
    const { state } = this;
    const values = state.form.tags.value.filter(
      (value, index) => index !== Number(evt.target.id),
    );
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
    editProjectAction(newTags.form);
  };
  handleFilesChange = files => {
    const { editProjectAction } = this.props;
    editProjectAction(files);
  };
  handleRemoveFile = file => {
    const { editProjectAction } = this.props;
    if (file) {
      editProjectAction({
        files: {
          value: file,
          changed: true,
        },
      });
    }
  };
  render() {
    const { activeProjectProcess, loggedUser } = this.props;
    const { author } = this.state;
    const { error, project, success } = activeProjectProcess;
    const user = loggedUser;
    return (
      <form
        id="edit-project-form"
        className="form"
        onKeyPress={this.handleFormKeyPress}
        noValidate
      >
        <div className="form-content">
          <CompanyHeader user={author} />
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
              success,
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
              success,
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
              success,
              error: error && error.dueDate && error.dueDate.detail,
            }}
          />
          {project.author._id === user._id && (
            <Checkbox
              config={{
                field: Model.isPrice,
                onChange: this.handleCheckBoxChange,
                value: this.state.form.isPrice.value,
                blur: this.handleOnBlur,
                readOnly: project.author._id !== user._id,
                focus: this.handleOnFocus,
                isFocused: this.state.form.isPrice.focus,
                success,
                error: error && error.isPrice && error.isPrice.detail,
              }}
            />
          )}

          {this.state.form.isPrice.value && (
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
                success,
                error: error && error.price && error.price.detail,
              }}
            />
          )}
          {project.author._id === user._id && (
            <Checkbox
              config={{
                field: Model.isContest,
                onChange: this.handleCheckBoxChange,
                value: this.state.form.isContest.value,
                blur: this.handleOnBlur,
                readOnly: project.author._id !== user._id,
                focus: this.handleOnFocus,
                isFocused: this.state.form.isContest.focus,
                success,
                error: error && error.isContest && error.isContest.detail,
              }}
            />
          )}
          {this.state.form.isContest.value && (
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
                success,
                error: error && error.maxTeam && error.maxTeam.detail,
              }}
            />
          )}
          <InputAutoComplete
            config={{
              field: Model.tags,
              onChange: this.handleInputSelectTagsChange,
              keyPress: this.handleInputSelectTagsChange,
              values: this.state.form.tags.value,
              readOnly: project.author._id !== user._id,
              success,
              error: error && error.tags && error.tags.detail,
              focus: this.handleOnFocus,
              isFocused: this.state.form.tags.focus,
              remove: this.handleRemove,
            }}
          />
          <DisplayDocument
            editable={loggedUser._id === project.author._id}
            update={this.handleFilesChange}
            keyToUpdate="files"
            files={project.files}
            onDelete={this.handleRemoveFile}
          />
        </div>
      </form>
    );
  }
}

export default EditFormProject;
