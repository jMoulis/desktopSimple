import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TaskFilter from '../containers/TaskFilter';
import TaskList from '../containers/TaskList';
import TaskDetailWrapper from '../containers/TaskDetailWrapper';
import Modal from '../../../../Modules/Modal/modal';
import TaskCreateForm from '../containers/TaskDetailWrapper/TaskDetail/TaskCreateForm';
import AppToolbar from '../../../../Modules/AppToolbar';

class Task extends React.Component {
  static propTypes = {
    fetchTasksAction: PropTypes.func.isRequired,
    taskListProcess: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
      filter: {},
    };
  }

  componentDidMount() {
    const { fetchTasksAction } = this.props;
    fetchTasksAction();
  }

  handleSelectFilter = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        [name]: value,
      },
    }));
  };
  handleShowCreateModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showCreateModal: !prevState.showCreateModal,
    }));
  };

  handleAppToolBarSearch = filter => {
    const { fetchTasksAction } = this.props;
    fetchTasksAction(filter);
  };

  render() {
    const { showCreateModal } = this.state;
    const { taskListProcess, fetchTasksAction } = this.props;
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
            searchFieldLabel: 'tags, Student name, Company name, Description',
          }}
        >
          <select name="status" onChange={this.handleSelectFilter}>
            <option value="">Select Status</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
          </select>
          <select name="priority" onChange={this.handleSelectFilter}>
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
          </select>
          <button
            type="submit"
            onClick={() => fetchTasksAction(this.state.filter)}
          >
            Filter
          </button>
        </AppToolbar>
        <div className="task-content d-flex full-height relative">
          <TaskFilter />
          {taskListProcess.tasks.length !== 0 ? (
            <Fragment>
              <TaskList />
              <TaskDetailWrapper />
            </Fragment>
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
