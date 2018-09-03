import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TaskToolbar from './TaskToolbar';
import TaskDisplayListInput from '../../../containers/TaskDetailWrapper/TaskDetail/TaskDisplayListInput';
import TaskDisplayDocuments from './TaskDisplayDocuments';

class TaskDetail extends React.Component {
  handleAssignTask = () => {};
  handleCloseTask = () => {};
  handleEditTask = () => {};
  handleNewComment = () => {};
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
        />
        <TaskDisplayListInput />
        <TaskDisplayDocuments documents={task.documents} />
      </div>
    );
  }
}

TaskDetail.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TaskDetail;
