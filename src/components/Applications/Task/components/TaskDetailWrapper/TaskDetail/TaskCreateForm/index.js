import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Input from '../../../../../../Form/input';
import Select from '../../../../../../Form/select';
import taskModel from './task-model';
import Textarea from '../../../../../../Form/textarea';
import FormButtonsContainer from '../../../../../../Form/formButtonContainer';
import './index.css';
import SelectBoxUser from '../../../../../../../Modules/SelectBoxUser';
import autoTextAreaResizing from '../../../../../../../Utils/autoTextAreaResizing';
import InputAutoComplete from '../../../../../../Form/inputAutoComplete';
import Modal from '../../../../../../../Modules/Modal/modal';
import Button from '../../../../../../Form/button';
import UserIconContainer from '../../../../../../../Modules/UserIcon';
import DisplayDocument from '../../../../../../../Modules/DisplayDocument';
// import { ROOT_URL } from '../../../../../../../Utils/config';

const ROOT_URL = process.env.REACT_APP_API;
class TaskCreateForm extends React.Component {
  static propTypes = {
    closeFromParent: PropTypes.func,
    createTaskAction: PropTypes.func.isRequired,
    taskCreation: PropTypes.object.isRequired,
    teamId: PropTypes.string,
    clearTaskMessageAction: PropTypes.func.isRequired,
    fetchTasksAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };

  static defaultProps = {
    closeFromParent: null,
    teamId: null,
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
      files: {
        value: [],
        changed: false,
      },
      assign: {
        value: {
          _id: props.loggedUser._id,
          fullName: props.loggedUser.fullName,
          picture: props.loggedUser.picture,
        },
        changed: true,
      },
      showUsersAssignModal: false,
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
    createTaskAction({
      ...this.state,
      assign: { value: JSON.stringify(this.state.assign.value), changed: true },
    });
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

  handleAssignSelected = user => {
    this.setState(() => ({
      assign: {
        value: user,
        changed: true,
      },
    }));
  };

  handleReassign = () => {
    this.setState(prevState => ({
      showUsersAssignModal: !prevState.showUsersAssignModal,
    }));
  };

  handleInputFileChange = ({ files }) => {
    this.setState(prevState => ({
      ...prevState,
      files: {
        changed: true,
        value: [...prevState.files.value, files.value],
      },
    }));
  };

  handleRemoveFile = file => {
    if (file) {
      this.setState(prevState => ({
        ...prevState,
        files: {
          changed: true,
          value: prevState.files.value.filter(
            document => document.name !== file,
          ),
        },
      }));
    }
  };

  handleTeamSelect = async evt => {
    const { value, name } = evt.target;
    try {
      const {
        data: { team },
      } = await axios({
        method: 'get',
        url: `${ROOT_URL}/api/teams/${value}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      this.setState(prevState => ({
        ...prevState,
        [name]: {
          ...prevState[name],
          value,
          changed: true,
        },
        selectedTeamUsers: team.users,
      }));
    } catch (error) {
      console.error('Error loading user from task create form', error.message);
    }
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
    const {
      title,
      description,
      status,
      priority,
      files,
      tags,
      showUsersAssignModal,
      assign,
      team,
      selectedTeamUsers,
    } = this.state;
    const { closeFromParent, taskCreation, loggedUser } = this.props;
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
            field: taskModel.team,
            onChange: this.handleTeamSelect,
            value: team.value,
            blur: this.handleOnBlur,
            focus: this.handleOnFocus,
            options: loggedUser.teams.map(team => ({
              value: team._id,
              label: team.name,
            })),
            error: error && error.team && error.team.detail,
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
        <DisplayDocument
          update={this.handleInputFileChange}
          keyToUpdate="files"
          files={files.value}
          onDelete={this.handleRemoveFile}
          editable
        />
        {assign.value && (
          <UserIconContainer user={{ user: assign.value }} name />
        )}
        {showUsersAssignModal ? (
          <Modal
            title="Select Assignee"
            zIndex={1}
            closeFromParent={this.handleReassign}
          >
            <SelectBoxUser
              users={selectedTeamUsers}
              callback={this.handleAssignSelected}
            />
          </Modal>
        ) : (
          <Button
            type="button"
            category="success"
            onClick={this.handleReassign}
            small
            label="Assign"
          />
        )}
        <FormButtonsContainer onCancel={{ action: closeFromParent }} onCreate />
      </form>
    );
  }
}

export default TaskCreateForm;
