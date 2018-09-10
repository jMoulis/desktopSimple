import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TaskToolbar from './TaskToolbar';
import ListInputContainer from '../../../containers/TaskDetailWrapper/TaskDetail/TaskDisplay/ListInput';

class TaskDetail extends React.Component {
  static propTypes = {
    task: PropTypes.object.isRequired,
    deleteTaskAction: PropTypes.func.isRequired,
  };

  handleAssignTask = () => {};
  handleCloseTask = () => {};
  handleEditTask = () => {};
  handleNewComment = () => {};
  handleDeleteTask = id => {
    const { deleteTaskAction } = this.props;
    deleteTaskAction(id);
  };
  render() {
    const { task } = this.props;
    return (
      <div className="task-detail">
        <h1>{task ? task.title : 'Loading'}</h1>
        <TaskToolbar
          assignAction={this.handleAssignTask}
          editAction={this.handleEditTask}
          commentAction={this.handleNewComment}
          closeAction={this.handleCloseTask}
          deleteAction={this.handleDeleteTask}
          data={task}
        />
        <ListInputContainer />
      </div>
    );
  }
}

export default TaskDetail;
