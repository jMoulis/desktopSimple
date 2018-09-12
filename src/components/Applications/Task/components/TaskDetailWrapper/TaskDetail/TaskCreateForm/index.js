import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../../../Form/input';
import Select from '../../../../../../Form/select';
import taskModel from './task-model';
import Textarea from '../../../../../../Form/textarea';
import FormButtonsContainer from '../../../../../../Form/formButtonContainer';
import './index.css';
import SelectBoxUser from '../../../../../../../Modules/SelectBoxUser';
import autoTextAreaResizing from '../../../../../../../Utils/autoTextAreaResizing';
import InputAutoComplete from '../../../../../../Form/inputAutoComplete';

class TaskCreateForm extends React.Component {
  static propTypes = {
    closeFromParent: PropTypes.func,
    createTaskAction: PropTypes.func.isRequired,
    taskCreation: PropTypes.object.isRequired,
    teamId: PropTypes.string.isRequired,
    clearTaskMessageAction: PropTypes.func.isRequired,
    fetchTasksAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    closeFromParent: null,
  };

  constructor(props) {
    super(props);
    let fields = {};
    Object.keys(taskModel).map(key => {
      fields = {
        ...fields,
        [key]: {
          value: taskModel[key].isArray ? [] : '',
          focus: false,
          changed: false,
        },
      };
      return {
        ...fields,
      };
    });
    this.state = {
      ...fields,
      files: [],
      team: {
        value: props.teamId,
      },
    };
  }
  componentDidUpdate() {
    const {
      taskCreation: { success },
      closeFromParent,
      fetchTasksAction,
    } = this.props;
    if (success) {
      fetchTasksAction({ filter: '' });
      return closeFromParent();
    }
    return true;
  }

  componentWillUnmount() {
    this.props.clearTaskMessageAction();
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const { createTaskAction } = this.props;
    createTaskAction(this.state);
  };

  handleInputChange = evt => {
    const { value, name } = evt.target;
    if (this.state.error) {
      this.setState(() => ({
        error: null,
      }));
    }
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  };

  handleTextAreaChange = evt => {
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
  };

  handleAssignSelected = userId => {
    this.setState(() => ({
      assign: {
        value: userId,
        changed: true,
      },
    }));
  };
  handleInputFileChange = evt => {
    const file = evt.target.files[0];
    this.setState(prevState => ({
      ...prevState,
      files: [...prevState.files, file],
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
    const { value } = evt.target;
    if (evt.keyCode === 13) {
      this.setState(prevState => ({
        ...prevState,
        tags: {
          ...prevState.tags,
          value: [...prevState.tags.value, value.toLowerCase()],
          changed: true,
        },
      }));
      evt.target.value = '';
    }
  };

  render() {
    const { title, description, status, priority, files, tags } = this.state;
    const { closeFromParent, taskCreation } = this.props;
    const { error } = taskCreation;
    return (
      <form
        id="task-form-create"
        className="form"
        onSubmit={this.handleSubmit}
        onKeyPress={this.handleFormKeyPress}
      >
        <Input
          config={{
            field: taskModel.title,
            onChange: this.handleInputChange,
            value: title.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.title && error.title.detail,
          }}
        />
        <Textarea
          config={{
            field: taskModel.description,
            onChange: this.handleTextAreaChange,
            value: description.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.description && error.description.detail,
          }}
        />
        <Select
          config={{
            field: taskModel.status,
            onChange: this.handleInputChange,
            value: status.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            options: [
              'To Do',
              'In Progress',
              'Reopened',
              'Need Testing',
              'On Hold',
              'Closed',
            ],
            error: error && error.status && error.status.detail,
          }}
        />
        <Select
          config={{
            field: taskModel.priority,
            onChange: this.handleInputChange,
            value: priority.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.priority && error.priority.detail,
            options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
          }}
        />
        <InputAutoComplete
          config={{
            field: taskModel.tags,
            onChange: this.handleInputSelectTagsChange,
            keyPress: this.handleInputSelectTagsChange,
            values: tags.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            remove: this.handleRemove,
            isFocused: tags.focus,
            error: error && error.tags && error.tags.detail,
          }}
        />
        <input type="file" multiple onChange={this.handleInputFileChange} />
        <ul>{files.map(document => <li>{document.name}</li>)}</ul>
        {files.length === 0 && <h2>No files available</h2>}
        <SelectBoxUser callback={this.handleAssignSelected} />
        <FormButtonsContainer onCancel={{ action: closeFromParent }} onCreate />
      </form>
    );
  }
}

export default TaskCreateForm;
