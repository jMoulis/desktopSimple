import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from '../../../../../../../Form/select';
import taskModel from '../../TaskCreateForm/task-model';
import DisplayDocument from '../../../../../../../../Modules/DisplayDocument';
import InputAutoComplete from '../../../../../../../Form/inputAutoComplete';
import Input from '../../../../../../../Form/input';
import SuccessIcon from '../../../../../../../../assets/successIcon/successIcon';
import './index.css';
import Textarea from '../../../../../../../Form/textarea';
import autoTextAreaResizing from '../../../../../../../../Utils/autoTextAreaResizing';
import UserIconContainer from '../../../../../../../../Modules/UserIcon';
import Modal from '../../../../../../../../Modules/Modal/modal';
import SelectBoxUserContainer from '../../../../../../../../Modules/SelectBoxUser';
import Button from '../../../../../../../Form/button';

// Needs to be outside of the class to be used in the getDerivedProps
const setStateFromProps = (object, model) => {
  let fields = {};
  Object.keys(model).map(key => {
    fields = {
      ...fields,
      [key]: object
        ? {
            value: object[key],
            changed: false,
            selected: false,
          }
        : {
            value: model[key].isArray ? [] : '',
            changed: false,
            selected: false,
          },
    };
    return { ...fields };
  });
  return {
    id: object._id || null,
    showUsersAssignModal: false,
    form: {
      ...fields,
      dueDate: object.dueDate
        ? {
            value: moment(object.dueDate).format('DD/MM/YYYY'),
            changed: false,
            selected: false,
          }
        : { value: '', changed: false, selected: false },
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
    if (
      task &&
      task.files &&
      task.files.length !== state.form.files.value.length
    ) {
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
          selected: true,
        },
      },
    }));
  };

  handleInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: {
          selected: true,
          changed: true,
          value,
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
      this.setState(() => ({
        showUploadFiles: false,
      }));
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

  handleRemove = evt => {
    evt.preventDefault();
    const { editTaskAction } = this.props;
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
    editTaskAction(newTags);
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
    const { editTaskAction } = this.props;
    if (this.state.form[field].changed) {
      editTaskAction(this.state.form);
    }
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

  handleReassign = () => {
    this.setState(prevState => ({
      showUsersAssignModal: !prevState.showUsersAssignModal,
    }));
  };

  handleSelectAssign = assignee => {
    const { editTaskAction } = this.props;
    if (assignee)
      return editTaskAction({
        assign: {
          changed: true,
          value: assignee._id,
        },
      });
  };

  render() {
    const { activeTaskProcess } = this.props;
    const { task, error, success } = activeTaskProcess;
    const { form, showUsersAssignModal } = this.state;
    const { status, priority, tags, dueDate, description, title } = form;
    return (
      <div className="task-detail">
        <header>
          <h1
            onKeyPress={() => this.handleLabelClick('title')}
            onClick={() => this.handleLabelClick('title')}
            data-name="title"
            className="d-flex flex-align-items-center"
          >
            {title && title.selected ? (
              <Input
                config={{
                  field: {
                    ...taskModel.title,
                    label: '',
                  },
                  onChange: this.handleInputChange,
                  keyPress: this.handleInputChange,
                  value: title.value,
                  blur: () => this.handleOnBlur(taskModel.title.name),
                  focus: this.handleOnFocus,
                  small: true,
                  success,
                  error: error && error.title && error.title.detail,
                  options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                }}
              />
            ) : (
              <span className="pointer">{title && title.value}</span>
            )}
            {success === 'title' && (
              <SuccessIcon
                style={{
                  top: 0,
                }}
              />
            )}
          </h1>
          <div className="d-flex flex-align-items-center">
            <UserIconContainer user={{ user: task.author }} />
            {task.createdAt && (
              <p className="small">
                created:
                {moment(task.createdAt).format('DD/MM/YYYY hh:mm')}
              </p>
            )}
          </div>
        </header>
        <ul className="task-detail-list">
          <li className="task-detail-list-item">
            <label
              onKeyPress={() => this.handleLabelClick('status')}
              onClick={() => this.handleLabelClick('status')}
              data-name="status"
              className="d-flex flex-align-items-center"
            >
              <span className="left-label-form bold">Status:</span>
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
                <span className="pointer">{status.value}</span>
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
              <span className="left-label-form bold">Priority:</span>
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
                <span className="pointer">{priority.value}</span>
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
          <li className="task-detail-list-item">
            <label
              onKeyPress={() => this.handleLabelClick('dueDate')}
              onClick={() => this.handleLabelClick('dueDate')}
              data-name="dueDate"
              className="d-flex flex-align-items-center"
            >
              <span className="left-label-form bold">Due Date:</span>
              {dueDate && dueDate.selected ? (
                <Input
                  config={{
                    field: taskModel.dueDate,
                    onChange: this.handleInputChange,
                    keyPress: this.handleInputChange,
                    value: dueDate.value,
                    blur: () => this.handleOnBlur(taskModel.dueDate.name),
                    focus: this.handleOnFocus,
                    small: true,
                    success,
                    error: error && error.dueDate && error.dueDate.detail,
                    options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                  }}
                />
              ) : (
                <span className="pointer">
                  {dueDate &&
                    dueDate.value &&
                    moment(dueDate.value).format('DD/MM/YYYY')}
                </span>
              )}
              {success === 'dueDate' && (
                <SuccessIcon
                  style={{
                    top: 0,
                  }}
                />
              )}
            </label>
          </li>
          <li className="task-detail-list-item d-flex flex-align-items-center">
            <span className="left-label-form bold">Assignee:</span>
            <div className="d-flex">
              <UserIconContainer
                containerCss={{ padding: 0 }}
                user={{ user: task.assign }}
                name
              />
              <Button
                style={{
                  margin: 0,
                }}
                type="button"
                category="success"
                onClick={this.handleReassign}
                small
              >
                Reassign
              </Button>
            </div>
          </li>
          <li className="task-detail-list-item task-detail-list-item--tags">
            <span className="left-label-form bold">Tags:</span>
            <InputAutoComplete
              config={{
                field: taskModel.tags,
                onChange: this.handleInputSelectLablelsChange,
                keyPress: this.handleInputSelectLablelsChange,
                values: tags.value,
                focus: this.handleOnFocus,
                remove: this.handleRemove,
                isFocused: tags.focus,
                error: error && error.tags && error.tags.detail,
              }}
            />
          </li>
          <li className="task-detail-list-item task-detail-list-item--description">
            <label
              onKeyPress={() => this.handleLabelClick('description')}
              onClick={() => this.handleLabelClick('description')}
              data-name="description"
              className="d-flex flex-column"
            >
              <span className="left-label-form bold">Description:</span>
              {description && description.selected ? (
                <Textarea
                  config={{
                    field: {
                      ...taskModel.description,
                      label: null,
                    },
                    onChange: this.handleTextAreaChange,
                    keyPress: this.handleTextAreaChange,
                    value: description.value,
                    blur: () => this.handleOnBlur(taskModel.description.name),
                    focus: this.handleOnFocus,
                    small: true,
                    success,
                    error:
                      error && error.description && error.description.detail,
                  }}
                />
              ) : (
                <p className="task-detail-list-item pointer">
                  {description.value}
                </p>
              )}
              {success === 'description' && (
                <SuccessIcon
                  style={{
                    position: 'absolute',
                    left: '150px',
                    top: 0,
                  }}
                />
              )}
            </label>
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
        {showUsersAssignModal && (
          <Modal
            title="Select Assignee"
            zIndex={1}
            closeFromParent={this.handleReassign}
          >
            <SelectBoxUserContainer callback={this.handleSelectAssign} />
          </Modal>
        )}
      </div>
    );
  }
}

export default ListInput;
