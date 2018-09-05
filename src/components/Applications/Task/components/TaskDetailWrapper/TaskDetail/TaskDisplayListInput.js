import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../../../Form/select';
import taskModel from './TaskCreateForm/task-model';
import FileUploader from '../../../../../../Modules/FileUploader/addFilesInput';
import TaskDisplayDocument from '../../../containers/TaskDetailWrapper/TaskDetail/TaskDocument';

// Needs to be outside of the class to be used in the getDerivedProps
const setStateFromProps = (object, model) => {
  let fields = {};
  Object.keys(model).map(key => {
    fields = {
      ...fields,
      [key]: object
        ? {
            value: object[key],
            focus: false,
            changed: false,
            selected: false,
          }
        : {
            value: model[key].isArray ? [] : '',
            focus: false,
            changed: false,
            selected: false,
          },
    };
    return { ...fields };
  });
  return {
    id: object._id || null,
    form: {
      ...fields,
    },
  };
};

class TaskDisplayListInput extends React.Component {
  static propTypes = {
    activeTaskProcess: PropTypes.object.isRequired,
    editTaskAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { activeTaskProcess } = props;
    const { task } = activeTaskProcess;
    const fields = setStateFromProps(task, taskModel);
    this.state = {
      ...fields,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { activeTaskProcess } = props;
    const { task } = activeTaskProcess;
    if (task.documents.length !== state.form.documents.value.length) {
      return { ...setStateFromProps(task, taskModel) };
    }
    if (task && task._id !== state.id) {
      const fields = setStateFromProps(task, taskModel);
      return {
        ...fields,
      };
    }
    return {
      ...state,
    };
  }

  handleLabelClick = evt => {
    const { name } = evt.currentTarget.dataset;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: {
          ...prevState.form[name],
          selected: true,
        },
      },
    }));
  };

  handleSelectChange = evt => {
    const { editTaskAction } = this.props;
    const { value, name } = evt.target;
    this.setState(
      prevState => ({
        form: {
          ...prevState.form,
          [name]: {
            value,
            changed: true,
            selected: false,
          },
        },
      }),
      () => {
        editTaskAction(this.state.form);
        this.setState(prevState => ({
          form: {
            ...prevState.form,
            [name]: {
              ...prevState.form[name],
              changed: false,
            },
          },
        }));
      },
    );
  };

  handleInputFileChange = file => {
    const { editTaskAction } = this.props;
    if (file) {
      editTaskAction({
        documents: {
          value: file,
          changed: true,
        },
      });
    }
  };

  handleRemoveFile = file => {
    const { editTaskAction } = this.props;
    if (file) {
      editTaskAction({
        documents: {
          value: file._id,
          changed: true,
        },
      });
    }
  };

  handleDownloadFile = file => {
    console.log(file);
  };

  render() {
    const { activeTaskProcess, fetchFileAction, editTaskAction } = this.props;
    const { task, error } = activeTaskProcess;
    const { status, priority, labels } = this.state.form;
    return (
      <Fragment>
        {!task ? (
          <div>Loading</div>
        ) : (
          <ul>
            <li>
              <label className="d-flex flex-align-items-center">
                <span className="left-label-form">Type:</span>
                <span>{task.type}</span>
              </label>
            </li>
            <li>
              <label
                onKeyPress={this.handleLabelClick}
                onClick={this.handleLabelClick}
                data-name="status"
                className="d-flex flex-align-items-center"
              >
                <span className="left-label-form">Status:</span>
                {status && status.selected ? (
                  <Select
                    config={{
                      field: taskModel.status,
                      onChange: this.handleSelectChange,
                      value: status.value,
                      options: [
                        'To Do',
                        'In Progress',
                        'Reopened',
                        'Need Testing',
                        'On Hold',
                        'Closed',
                      ],
                      small: true,
                      error: error && error.status && error.status.detail,
                    }}
                  />
                ) : (
                  <span>{status.value}</span>
                )}
              </label>
            </li>
            <li>
              <label
                onKeyPress={this.handleLabelClick}
                onClick={this.handleLabelClick}
                data-name="priority"
                className="d-flex flex-align-items-center"
              >
                <span className="left-label-form">Priority:</span>
                {priority && priority.selected ? (
                  <Select
                    config={{
                      field: taskModel.priority,
                      onChange: this.handleSelectChange,
                      value: priority.value,
                      blur: this.handleOnBlur,
                      focus: this.handleOnFocus,
                      small: true,
                      error: error && error.priority && error.priority.detail,
                      options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                    }}
                  />
                ) : (
                  <span>{priority.value}</span>
                )}
              </label>
            </li>
            <li>
              <label
                onKeyPress={this.handleLabelClick}
                onClick={this.handleLabelClick}
                data-name="labels"
                className="d-flex flex-align-items-center"
              >
                <span className="left-label-form">Labels:</span>
                {labels && labels.selected ? (
                  <Select
                    config={{
                      field: taskModel.labels,
                      onChange: this.handleSelectChange,
                      value: labels.value,
                      blur: this.handleOnBlur,
                      multiple: true,
                      focus: this.handleOnFocus,
                      small: true,
                      options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                      error: error && error.labels && error.labels.detail,
                    }}
                  />
                ) : (
                  <span>{labels.value}</span>
                )}
              </label>
            </li>
            <li>
              <label className="left-label-form">Description:</label>
              <p>{task.description}</p>
            </li>
            <li>
              <TaskDisplayDocument
                fetchFileAction={fetchFileAction}
                update={editTaskAction}
                fileProcess={activeTaskProcess}
                documents={task.documents}
              />
              {/* <FileUploader
                error={error && error.documents && error.documents.detail}
                docs={task.documents}
                onFileChange={this.handleInputFileChange}
                onFileDelete={this.handleRemoveFile}
                handleDownloadFile={this.handleDownloadFile}
              /> */}
            </li>
          </ul>
        )}
      </Fragment>
    );
  }
}

export default TaskDisplayListInput;
