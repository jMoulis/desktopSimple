import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Model from '../Model/project-model';
import Input from '../../../../Form/input';
import Textarea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';
import Checkbox from '../../../../Form/checkbox';
import InfoPanel from '../../containers/DetailProject/InfoPanel';
import AddFilesInput from '../../../../../Modules/filesHandler/addFilesInput';

class DetailProject extends React.Component {
  static propTypes = {
    activeProjectProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    editProjectAction: PropTypes.func.isRequired,
    openNewTeamModal: PropTypes.func.isRequired,
    deleteProjectAction: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
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
      delete: false,
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
  handleFormKeyPress = (evt) => {
    if (evt.key === 'Enter' && evt.target.type !== 'textarea' && evt.target.type !== 'submit') {
      evt.preventDefault();
      return false;
    }
    return true;
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
  handleInputSelectTagsChange = (evt) => {
    const inputValue = evt.target.value;
    const { editProjectAction } = this.props;
    if (evt.keyCode === 13 || evt.keyCode === 32 || evt.keyCode === 188) {
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
  handleInputDateChange = (evt) => {
    const date = new Date(evt.target.value);
    console.log(date.toString())
    if (date.toString() !== 'Invalid Date') {
      this.setState(prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          dueDate: {
            value: date,
            changed: true,
          },
        },
      }));
      console.log('Good')
    }
    else {
      console.log('invalid date')
    }
  }
  handleDeleteProject = (evt) => {
    const { deleteProjectAction, activeProjectProcess, close } = this.props;
    deleteProjectAction(activeProjectProcess.project._id);
    const evtTargetChild = evt.currentTarget;
    this.setState(prevState => ({
      ...prevState,
      delete: true,
      evtTargetChild,
    }), () => {
      setTimeout(() => {
        this.setState(prevState => ({
          ...prevState,
          delete: false,
        }));
        close(evtTargetChild);
      }, 1000);
    });
    // close(evt);
  }
  handleSubscribe = (evt) => {
    const { name } = evt.target;
    let subscribers = [];
    const { editProjectAction, loggedUser } = this.props;
    if (name === 'unsubscribe') {
      subscribers = this.state.form.subscribers.value.filter(subscriber => (
        subscriber !== loggedUser.user._id));
    }
    else {
      subscribers = [
        ...this.state.form.subscribers.value,
        loggedUser.user._id,
      ];
    }
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        subscribers: {
          value: subscribers,
          changed: true,
        },
      },
    }), () => editProjectAction(this.state.form));
  }
  render() {
    const { activeProjectProcess, openNewTeamModal, loggedUser } = this.props;
    const { error, loading, project } = activeProjectProcess;
    const { user } = loggedUser;
    if (loading || Object.keys(project).length === 0) {
      if (this.state.delete) {
        return <span>Message confirmation deleted</span>;
      }
      return <span>loading</span>;
    }
    return (
      <div id="edit-project" className="form-container" key="app-content" >
        <form
          id="edit-project-form"
          className="form"
          onKeyPress={this.handleFormKeyPress}
          noValidate="true"
        >
          <div className="form-content-wrapper">
            <div className="form-content">
              <Input
                config={{
                  field: Model.title,
                  onChange: this.handleInputChange,
                  value: this.state.form.title.value,
                  blur: this.handleOnBlur,
                  keyPress: this.handleInputChange,
                  readOnly: project.author._id !== user._id,
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
                  error: error && error.isContest && error.isContest.detail,
                }}
              />
              {this.state.form.isContest.value &&
                <Input
                  config={{
                    field: Model.maxTeam,
                    onChange: this.handleInputChange,
                    value: this.state.form.maxTeam.value,
                    blur: this.handleOnBlur,
                    focus: this.handleOnFocus,
                    keyPress: this.handleInputChange,
                    readOnly: project.author._id !== user._id,
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
            <div className="form-content">
              <InfoPanel openCreateTeamModal={openNewTeamModal} user={user} />
            </div>
            {project.author._id === user._id &&
              <div className="form-content">
                <button
                  name="detailProjectModal"
                  type="button"
                  onClick={this.handleDeleteProject}
                >Delete
                </button>
              </div>
            }
            <div className="form-content">
              {project.author._id !== user._id &&
                project.subscribers &&
                  <button
                    name={project.subscribers.includes(user._id) ? 'unsubscribe' : 'subscribe'}
                    className="btn-subscribe"
                    type="button"
                    onClick={this.handleSubscribe}
                  >{project.subscribers.includes(user._id) ? 'Unsubscribe' : 'Subscribe'}
                  </button>}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default DetailProject;
