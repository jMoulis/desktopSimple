import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../../../Form/input';
import taskModel from './task-model';
import AddFilesInput from '../../../../../../../Modules/filesHandler/addFilesInput';
import Textarea from '../../../../../../Form/textarea';
import FormButtonsContainer from '../../../../../../Form/formButtonContainer';
import './index.css';

class TaskCreateForm extends React.Component {
  static propTypes = {
    closeFromParent: PropTypes.func.isRequired,
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
      return fields;
    });
    this.state = {
      ...fields,
    };
  }

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

  handleInputFileChange = docs => {
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
  };

  render() {
    const {
      title,
      description,
      status,
      priority,
      labels,
      documents,
      type,
      assign,
    } = this.state;
    const { closeFromParent } = this.props;
    return (
      <form id="task-form-create" className="form">
        <Input
          config={{
            field: taskModel.title,
            onChange: this.handleInputChange,
            value: title.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <Textarea
          config={{
            field: taskModel.description,
            onChange: this.handleInputChange,
            value: description.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <Input
          config={{
            field: taskModel.status,
            onChange: this.handleInputChange,
            value: status.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <Input
          config={{
            field: taskModel.priority,
            onChange: this.handleInputChange,
            value: priority.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <Input
          config={{
            field: taskModel.labels,
            onChange: this.handleInputChange,
            value: labels.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <AddFilesInput
          // error={error && error.docs && error.docs.detail}
          docs={documents.value}
          onFileChange={this.handleInputFileChange}
          blur={this.handleOnBlur}
        />
        {documents.value.length === 0 && <h2>No Documents available</h2>}
        <Input
          config={{
            field: taskModel.type,
            onChange: this.handleInputChange,
            value: type.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <Input
          config={{
            field: taskModel.assign,
            onChange: this.handleInputChange,
            value: assign.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            // error: error && error.newPassword && error.newPassword.detail,
          }}
        />
        <FormButtonsContainer onCancel={{ action: closeFromParent }} onCreate />
      </form>
    );
  }
}

export default TaskCreateForm;
