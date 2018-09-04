import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../../../Form/select';
import taskModel from './TaskCreateForm/task-model';

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

  render() {
    const { activeTaskProcess } = this.props;
    const { task, error } = activeTaskProcess;
    const { status, priority, labels } = this.state.form;
    return (
      <Fragment>
        {!task ? (
          <div>Loading</div>
        ) : (
          <ul>
            <li>
              <label>
                Type:
                <span>{task.type}</span>
              </label>
            </li>
            <li>
              <label
                onKeyPress={this.handleLabelClick}
                onClick={this.handleLabelClick}
                data-name="status"
              >
                Status:
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
              >
                Priority:
                {priority && priority.selected ? (
                  <Select
                    config={{
                      field: taskModel.priority,
                      onChange: this.handleSelectChange,
                      value: priority.value,
                      blur: this.handleOnBlur,
                      focus: this.handleOnFocus,
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
              >
                Labels:
                {labels && labels.selected ? (
                  <Select
                    config={{
                      field: taskModel.labels,
                      onChange: this.handleSelectChange,
                      value: labels.value,
                      blur: this.handleOnBlur,
                      multiple: true,
                      focus: this.handleOnFocus,
                      error: error && error.labels && error.labels.detail,
                      options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                    }}
                  />
                ) : (
                  <span>{labels.value}</span>
                )}
              </label>
            </li>
            <li>
              <label>Description:</label>
              <p>{task.description}</p>
            </li>
          </ul>
        )}
      </Fragment>
    );
  }
}

export default TaskDisplayListInput;
