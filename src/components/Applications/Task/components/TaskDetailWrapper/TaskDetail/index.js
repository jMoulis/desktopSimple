import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './index.css';
import ListInputContainer from '../../../containers/TaskDetailWrapper/TaskDetail/TaskDisplay/ListInput';
import UserIconContainer from '../../../../../../Modules/UserIcon';

class TaskDetail extends React.Component {
  static propTypes = {
    task: PropTypes.object.isRequired,
    deleteTaskAction: PropTypes.func.isRequired,
  };

  handleAssignTask = () => {};
  handleNewComment = () => {};
  handleDeleteTask = id => {
    const { deleteTaskAction } = this.props;
    deleteTaskAction(id);
  };
  render() {
    const { task } = this.props;
    return (
      <div className="task-detail">
        <header>
          <h1>{task ? task.title : 'Loading'}</h1>
          <div className="d-flex flex-align-items-center">
            <UserIconContainer user={{ user: task.author }} />

            {task.createdAt && (
              <p className="small">
                created:
                {moment(task.createdAt).format('DD/MM/YYYY hh:mm')}
              </p>
            )}
          </div>
        </header>
        <ListInputContainer />
      </div>
    );
  }
}

export default TaskDetail;
