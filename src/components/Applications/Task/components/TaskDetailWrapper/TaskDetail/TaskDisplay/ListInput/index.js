import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../../../../../Form/select';
import taskModel from '../../TaskCreateForm/task-model';
import DisplayDocument from '../../../../../../../../Modules/DisplayDocument';
import InputAutoComplete from '../../../../../../../Form/inputAutoComplete';
import SuccessIcon from '../../../../../../../../assets/successIcon/successIcon';
import './index.css';

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

class ListInput extends React.Component {
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
      showLabelsModal: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { activeTaskProcess } = props;
    const { task } = activeTaskProcess;
    if (task.files.length !== state.form.files.value.length) {
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

  handleLabelClick = name => {
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

  handleInputFileChange = files => {
    const { editTaskAction } = this.props;
    if (files) {
      editTaskAction(files);
    }
  };

  handleRemoveFile = file => {
    const { editTaskAction } = this.props;
    if (file) {
      editTaskAction({
        files: {
          value: file,
          changed: true,
        },
      });
    }
  };

  handleInputSelectLablelsChange = evt => {
    const { editTaskAction } = this.props;
    const { value } = evt.target;
    if (evt.keyCode === 13) {
      this.setState(
        prevState => ({
          ...prevState,
          form: {
            ...prevState.form,
            tags: {
              ...prevState.form.tags,
              value: [...prevState.form.tags.value, value.toLowerCase()],
              changed: true,
            },
          },
        }),
        () => {
          editTaskAction(this.state.form);
        },
      );
      evt.target.value = '';
    }
  };

  handleDisplayLabelsModal = () => {
    this.setState(prevState => ({
      showLabelsModal: !prevState.showLabelsModal,
    }));
  };

  handleOnBlur = field => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [field]: {
          ...prevState.form[field],
          selected: false,
        },
      },
    }));
  };

  render() {
    const { activeTaskProcess } = this.props;
    const { task, error, success } = activeTaskProcess;
    const { form } = this.state;
    const { status, priority, tags } = form;
    console.log(task.files);
    return (
      <Fragment>
        {!task ? (
          <div>Loading</div>
        ) : (
          <ul className="task-detail-list">
            <li className="task-detail-list-item">
              <label
                onKeyPress={() => this.handleLabelClick('status')}
                onClick={() => this.handleLabelClick('status')}
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
                      blur: () => this.handleOnBlur(taskModel.status.name),
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
                {success === 'status' && (
                  <SuccessIcon
                    style={{
                      top: 0,
                    }}
                  />
                )}
              </label>
            </li>
            <li className="task-detail-list-item">
              <label
                onKeyPress={() => this.handleLabelClick('priority')}
                onClick={() => this.handleLabelClick('priority')}
                data-name="priority"
                className="d-flex flex-align-items-center"
              >
                <span className="left-label-form">Priority:</span>
                {priority && priority.selected ? (
                  <Select
                    config={{
                      field: taskModel.priority,
                      onChange: this.handleSelectChange,
                      keyPress: this.handleSelectChange,
                      value: priority.value,
                      blur: () => this.handleOnBlur(taskModel.priority.name),
                      focus: this.handleOnFocus,
                      small: true,
                      success,
                      error: error && error.priority && error.priority.detail,
                      options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                    }}
                  />
                ) : (
                  <span>{priority.value}</span>
                )}
                {success === 'priority' && (
                  <SuccessIcon
                    style={{
                      top: 0,
                    }}
                  />
                )}
              </label>
            </li>
            <li className="task-detail-list-item task-detail-list-item--tags">
              <label
                data-name="labels"
                className="d-flex flex-align-items-center"
              >
                <span className="left-label-form">Labels:</span>
              </label>
              <InputAutoComplete
                config={{
                  field: taskModel.tags,
                  onChange: this.handleInputSelectLablelsChange,
                  keyPress: this.handleInputSelectLablelsChange,
                  values: tags.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  remove: this.handleRemove,
                  isFocused: tags.focus,
                  error: error && error.tags && error.tags.detail,
                }}
              />
            </li>
            <li className="task-detail-list-item">
              <span className="left-label-form">Description:</span>
              <p className="task-detail-list-item--textarea">
                {task.description}
              </p>
            </li>
            <li className="task-detail-list-item">
              <DisplayDocument
                update={this.handleInputFileChange}
                keyToUpdate="files"
                files={task.files}
                onDelete={this.handleRemoveFile}
                editable
              />
            </li>
          </ul>
        )}
      </Fragment>
    );
  }
}

export default ListInput;
