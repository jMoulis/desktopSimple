import React from 'react';

import TaskFilter from '../containers/TaskFilter';
import TaskList from '../containers/TaskList';
import TaskDetailWrapperContainer from '../containers/TaskDetailWrapper';
import Modal from '../../../../Modules/Modal/modal';
import './index.css';
import TaskCreateForm from './TaskDetailWrapper/TaskDetail/TaskCreateForm.js';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
    };
  }
  handleShowCreateModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showCreateModal: !prevState.showCreateModal,
    }));
  };

  render() {
    const { showCreateModal } = this.state;
    return (
      <div id="task" className="d-flex flex-column">
        <ul className="ul-nav">
          <li>
            <button onClick={this.handleShowCreateModal}>Create</button>
          </li>
          <li>Display Card</li>
          <li>Display list</li>
        </ul>
        <div className="d-flex">
          <TaskFilter />
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
