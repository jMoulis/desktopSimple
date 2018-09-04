import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TaskFilter from '../containers/TaskFilter';
import TaskList from '../containers/TaskList';
import TaskDetailWrapperContainer from '../containers/TaskDetailWrapper';
import Modal from '../../../../Modules/Modal/modal';
import MaskLoader from '../../../../Modules/MaskLoader';
import TaskCreateForm from '../containers/TaskDetailWrapper/TaskDetail/TaskCreateForm';
import TaskNavBar from './TaskNavBar';

class Task extends React.Component {
  static propTypes = {
    fetchTasksAction: PropTypes.func.isRequired,
    taskListProcess: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
    };
  }

  componentDidMount() {
    const { fetchTasksAction } = this.props;
    fetchTasksAction({ filter: '' });
  }
  handleShowCreateModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showCreateModal: !prevState.showCreateModal,
    }));
  };

  render() {
    const { showCreateModal } = this.state;
    const { fetchTasksAction, taskListProcess } = this.props;
    return (
      <div className="task d-flex flex-column full-height">
        <TaskNavBar onClick={this.handleShowCreateModal} />
        <div className="task-content d-flex full-height relative overflow">
          <TaskFilter fetchTasksAction={fetchTasksAction} />
          {taskListProcess.tasks.length !== 0 ? (
            <Fragment>
              <TaskList />
              <TaskDetailWrapperContainer />
            </Fragment>
          ) : (
            <div className="d-flex flex1 flex-justify-center flex-align-items-center">
              <h1>{taskListProcess.error && taskListProcess.error.detail}</h1>
            </div>
          )}
          {taskListProcess.loading && <MaskLoader />}
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
