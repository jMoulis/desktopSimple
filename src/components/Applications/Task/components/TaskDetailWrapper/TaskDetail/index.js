import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from '../../../../../Form/select';
import taskModel from './TaskCreateForm/task-model';
import DisplayDocument from '../../../../../../Modules/DisplayDocument';
import InputAutoComplete from '../../../../../Form/inputAutoComplete';
import SuccessIcon from '../../../../../../assets/successIcon/successIcon';
import Textarea from '../../../../../Form/textarea';
import autoTextAreaResizing from '../../../../../../Utils/autoTextAreaResizing';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import Modal from '../../../../../../Modules/Modal/modal';
import SelectBoxUserContainer from '../../../../../../Modules/SelectBoxUser';
import Button from '../../../../../Form/button';
import './index.css';
import AlertBox from '../../../../../../Modules/AlertBox';

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

class TaskDetail extends React.Component {
  static propTypes = {
    activeTaskProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    editTaskAction: PropTypes.func.isRequired,
    deleteTaskAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { activeTaskProcess } = props;
    const { task } = activeTaskProcess;
    const fields = setStateFromProps(task, taskModel);
    this.state = {
      ...fields,
      showLabelsModal: false,
      showAlertBox: false,
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

  handleInputSelectTagsChange = evt => {
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

  handleRemoveTags = evt => {
    evt.preventDefault();
    const { editTaskAction } = this.props;
    const { state } = this;
    const values = state.form.tags.value.filter(
      (value, index) => index !== Number(evt.target.id),
    );
    this.setState(
      prevState => ({
        ...prevState,
        form: {
          ...prevState.form,
          tags: {
            ...prevState.form.tags,
            value: values,
            changed: true,
          },
        },
      }),
      () => {
        editTaskAction(this.state.form);
      },
    );
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
          value: JSON.stringify(assignee),
        },
      });
  };

  handleDeleteTask = () => {
    const {
      deleteTaskAction,
      activeTaskProcess: { task },
    } = this.props;
    if (!task) return null;
    deleteTaskAction(task._id);
  };

  handleShowAlertBox = () => {
    this.setState(prevState => ({
      ...prevState,
      showAlertBox: !prevState.showAlertBox,
    }));
  };

  render() {
    const { activeTaskProcess, loggedUser } = this.props;
    const { task, error, success } = activeTaskProcess;
    const { form, showUsersAssignModal, showAlertBox } = this.state;
    const { status, priority, tags, dueDate, description, title, team } = form;
    if (!task) return <h1>Oups! No tasks found for</h1>;
    return (
      <div className="task-detail">
        <header className="task-detail--header">
          <div>
            <div
              onKeyPress={() => this.handleLabelClick('title')}
              onClick={() => this.handleLabelClick('title')}
              data-name="title"
              style={{ height: '24px', fontWeight: 'bold', fontSize: '1.5rem' }}
              className="d-flex flex-align-items-center"
            >
              {title && title.selected ? (
                <input
                  name="title"
                  type="text"
                  value={title.value}
                  onChange={this.handleInputChange}
                  style={{
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                  }}
                  onBlur={() => this.handleOnBlur('title')}
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
            </div>
            <div className="d-flex flex-align-items-center">
              <UserIconContainer
                user={{
                  user: {
                    _id: task.author._id,
                    picture: task.author.picture,
                    fullName: task.author.fullName,
                  },
                }}
              />
              {task.createdAt && (
                <p className="small">
                  created:
                  {moment(task.createdAt).format('DD/MM/YYYY hh:mm')}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              category="danger"
              label="Delete"
              onClick={this.handleShowAlertBox}
            />
          </div>
        </header>
        <ul className="task-detail-list">
          <li className="task-detail-list-item">
            <label
              onKeyPress={() => this.handleLabelClick('team')}
              onClick={() => this.handleLabelClick('team')}
              data-name="team"
              className="d-flex flex-align-items-center"
            >
              <span className="left-label-form bold">team:</span>
              {team && team.selected ? (
                <Select
                  config={{
                    field: taskModel.team,
                    onChange: this.handleSelectChange,
                    value: (team.value && team.value.name) || '',
                    blur: () => this.handleOnBlur(taskModel.team.name),
                    options: loggedUser.teams.map(team => ({
                      value: team._id,
                      label: team.name,
                    })),
                    error: error && error.team && error.team.detail,
                  }}
                />
              ) : (
                <span className="pointer">{task.team && task.team.name}</span>
              )}
              {success === 'team' && (
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
                      {
                        value: 'to_do',
                        label: 'To Do',
                      },
                      {
                        value: 'in_progress',
                        label: 'In Progress',
                      },
                      {
                        value: 'reopened',
                        label: 'Reopend',
                      },
                      {
                        value: 'need_testing',
                        label: 'Need Testing',
                      },
                      {
                        value: 'on_hold',
                        label: 'On Hold',
                      },
                      {
                        value: 'closed',
                        label: 'Closed',
                      },
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
                    options: [
                      {
                        value: 'highest',
                        label: 'Highest',
                      },
                      {
                        value: 'high',
                        label: 'High',
                      },
                      {
                        value: 'medium',
                        label: 'Medium',
                      },
                      {
                        value: 'low',
                        label: 'Low',
                      },
                      {
                        value: 'lowest',
                        label: 'Lowest',
                      },
                    ],
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
                <input
                  name="dueDate"
                  type="text"
                  value={dueDate.value}
                  onChange={this.handleInputChange}
                  style={{
                    border: 'none',
                  }}
                  onBlur={() => this.handleOnBlur('dueDate')}
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
                onChange: this.handleInputSelectTagsChange,
                keyPress: this.handleInputSelectTagsChange,
                values: tags.value,
                focus: this.handleOnFocus,
                remove: this.handleRemoveTags,
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
            <SelectBoxUserContainer
              users={task.team.users}
              callback={this.handleSelectAssign}
            />
          </Modal>
        )}
        {showAlertBox && (
          <AlertBox
            title="Confirmation: Delete Task"
            message="Watch out, Are you really willing to delete this task?"
            buttons={[
              {
                type: 'danger',
                action: this.handleDeleteTask,
                label: 'Yeap',
                category: 'danger',
              },
              {
                type: 'success',
                action: this.handleShowAlertBox,
                label: 'Nope',
                category: 'success',
              },
            ]}
            type="danger"
          />
        )}
      </div>
    );
  }
}

export default TaskDetail;
