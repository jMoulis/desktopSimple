import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../../../Form/input';
import taskModel from './task-model';
import AddFilesInput from '../../../../../../../Modules/filesHandler/addFilesInput';
import Textarea from '../../../../../../Form/textarea';
import FormButtonsContainer from '../../../../../../Form/formButtonContainer';
import './index.css';
import SelectBoxUser from '../../../../../../../Modules/SelectBoxUser';

class TaskCreateForm extends React.Component {
  static propTypes = {
    closeFromParent: PropTypes.func,
    createTaskAction: PropTypes.func.isRequired,
    taskCreation: PropTypes.object.isRequired,
    teamId: PropTypes.string.isRequired,
    clearTaskMessageAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    closeFromParent: null,
  };

  constructor(props) {
    super(props);
    // 'id:noRYYNn8cLsAAAAAAAAA0Q'
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
      documents: [],
      team: {
        value: props.teamId,
      },
    };
  }
  componentDidUpdate() {
    const {
      taskCreation: { success },
      closeFromParent,
    } = this.props;
    if (success) {
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
      disabled: true,
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
  // handleInputFileChange = evt => {
  //   const file = evt.target.files[0];
  //   this.setState(prevState => ({
  //     ...prevState,
  //     documents: {
  //       value: file,
  //       changed: true,
  //     },
  //   }));
  // };
  handleInputFileChange = docs => {
    this.setState(prevState => ({
      ...prevState,
      documents: docs,
    }));
  };

  render() {
    const {
      title,
      description,
      status,
      priority,
      documents,
      type,
    } = this.state;
    const { closeFromParent, taskCreation } = this.props;
    const { error } = taskCreation;
    return (
      <form id="task-form-create" className="form" onSubmit={this.handleSubmit}>
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
            onChange: this.handleInputChange,
            value: description.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.description && error.description.detail,
          }}
        />
        <Input
          config={{
            field: taskModel.status,
            onChange: this.handleInputChange,
            value: status.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.status && error.status.detail,
          }}
        />
        <Input
          config={{
            field: taskModel.priority,
            onChange: this.handleInputChange,
            value: priority.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.priority && error.priority.detail,
          }}
        />
        {/* <Input
          config={{
            field: taskModel.labels,
            onChange: this.handleInputChange,
            value: labels.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.labels && error.labels.detail,
          }}
        /> */}
        <AddFilesInput
          error={error && error.documents && error.documents.detail}
          docs={documents}
          onFileChange={this.handleInputFileChange}
          blur={this.handleOnBlur}
        />
        {documents.length === 0 && <h2>No Documents available</h2>}
        <Input
          config={{
            field: taskModel.type,
            onChange: this.handleInputChange,
            value: type.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            error: error && error.type && error.type.detail,
          }}
        />
        <SelectBoxUser callback={this.handleAssignSelected} />
        <FormButtonsContainer onCancel={{ action: closeFromParent }} onCreate />
      </form>
    );
  }
}

export default TaskCreateForm;
