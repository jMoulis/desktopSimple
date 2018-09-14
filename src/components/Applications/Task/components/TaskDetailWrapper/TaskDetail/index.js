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
        <ListInputContainer />
      </div>
    );
  }
}

export default TaskDetail;
