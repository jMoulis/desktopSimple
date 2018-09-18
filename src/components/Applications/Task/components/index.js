import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TaskList from '../containers/TaskList';
import TaskDetailWrapper from '../containers/TaskDetailWrapper';
import Modal from '../../../../Modules/Modal/modal';
import TaskCreateForm from '../containers/TaskDetailWrapper/TaskDetail/TaskCreateForm';
import AppToolbar from '../../../../Modules/AppToolbar';
import SelectBoxAssigneeContainer from '../containers/SelectBoxAssignee';
import Utils from '../../../../Utils/utils';
import SelectBoxToolBar from '../../../../Modules/AppToolbar/SelectBoxToolBar';

class Task extends React.Component {
  static propTypes = {
    fetchTasksAction: PropTypes.func.isRequired,
    taskListProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    activeTeam: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.utils = new Utils();
    this.state = {
      showCreateModal: false,
      filter: {},
    };
  }

  componentDidMount() {
    const { fetchTasksAction, activeTeam } = this.props;
    if (activeTeam._id) return fetchTasksAction({ team: activeTeam._id });
    return fetchTasksAction();
  }

  handleSelectFilter = evt => {
    const { name, value } = evt.target;
    const { fetchTasksAction } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        filter: {
          ...prevState.filter,
          [name]: value,
        },
      }),
      () => {
        fetchTasksAction(this.state.filter);
      },
    );
  };

  handleSelectAssign = evt => {
    evt.stopPropagation();
    const { value } = evt.currentTarget.dataset;
    const { fetchTasksAction } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        filter: {
          ...prevState.filter,
          'assign._id': value,
        },
      }),
      () => {
        fetchTasksAction(this.state.filter);
      },
    );
  };

  handleShowCreateModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showCreateModal: !prevState.showCreateModal,
    }));
  };

  handleAppToolBarSearch = searchFilter => {
    const { fetchTasksAction } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        filter: {
          ...prevState.filter,
          filter: searchFilter.filter,
        },
      }),
      () => {
        fetchTasksAction(this.state.filter);
        this.setState(prevState => ({
          filter: {
            ...prevState.filter,
            filter: '',
          },
        }));
      },
    );
  };

  render() {
    const { showCreateModal } = this.state;
    const { taskListProcess, loggedUser } = this.props;
    return (
      <div className="task d-flex flex-column full-height">
        <AppToolbar
          menus={[
            {
              label: 'New Task',
              action: this.handleShowCreateModal,
              show: true,
            },
          ]}
          search={{
            show: true,
            searchField: true,
            action: this.handleAppToolBarSearch,
            searchFieldLabel: 'Contains text',
          }}
        >
          <div className="d-flex flex-align-items-center">
            <SelectBoxToolBar
              name="team"
              callback={this.handleSelectFilter}
              options={[
                {
                  value: '',
                  label: 'Select Team',
                },
                ...loggedUser.teams.map(team => ({
                  value: team._id,
                  label: team.name,
                })),
              ]}
            />
            <SelectBoxToolBar
              name="status"
              callback={this.handleSelectFilter}
              options={[
                {
                  label: 'Select status',
                  value: '',
                },
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
              ]}
            />
            <SelectBoxToolBar
              name="priority"
              callback={this.handleSelectFilter}
              options={[
                {
                  label: 'Select level',
                  value: '',
                },
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
              ]}
            />

            <SelectBoxAssigneeContainer
              teamId={this.state.filter.team}
              callback={this.handleSelectAssign}
            />
          </div>
        </AppToolbar>
        <div className="task-content d-flex full-height relative">
          <TaskList />
          {taskListProcess.tasks.length !== 0 ? (
            <TaskDetailWrapper />
          ) : (
            <div className="d-flex flex1 flex-justify-center flex-align-items-center">
              <h1>{taskListProcess.error && taskListProcess.error.detail}</h1>
            </div>
          )}
        </div>
        {showCreateModal && (
          <Modal
            closeFromParent={this.handleShowCreateModal}
            name="task"
            title="Create a task"
            zIndex={1}
          >
            <TaskCreateForm />
          </Modal>
        )}
      </div>
    );
  }
}

export default Task;
