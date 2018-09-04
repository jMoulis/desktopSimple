import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TaskFilter from '../containers/TaskFilter';
import TaskList from '../containers/TaskList';
import TaskDetailWrapperContainer from '../containers/TaskDetailWrapper';
import Modal from '../../../../Modules/Modal/modal';
import TaskCreateForm from '../containers/TaskDetailWrapper/TaskDetail/TaskCreateForm';
import Loader from '../../../../Modules/Loader';

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
    if (taskListProcess.loading) {
      return <Loader />;
    }
    return (
      <div id="task" className="d-flex flex-column full-height">
        <ul className="ul-nav">
          <li>
            <button onClick={this.handleShowCreateModal}>Create</button>
          </li>
          <li>Display Card</li>
          <li>Display list</li>
        </ul>
        <div className="d-flex full-height">
          <TaskFilter fetchTasksAction={fetchTasksAction} />
          <TaskList />
          <TaskDetailWrapperContainer />
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
