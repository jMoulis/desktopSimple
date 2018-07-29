import React from 'react';
import PropTypes from 'prop-types';

import TaskFilter from '../containers/TaskFilter';
import TaskList from '../containers/TaskList';
import TaskDetailWrapperContainer from '../containers/TaskDetailWrapper';
import Modal from '../../../../Modules/Modal/modal';
import './index.css';
import TaskCreateForm from '../containers/TaskDetailWrapper/TaskDetail/TaskCreateForm';

class Task extends React.Component {
  static propTypes = {
    fetchTasksAction: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
    };
  }

  componentDidMount() {
    const { fetchTasksAction } = this.props;
    fetchTasksAction();
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
