import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import ListInputContainer from '../../../containers/TaskDetailWrapper/TaskDetail/TaskDisplay/ListInput';

class TaskDetail extends React.Component {
  static propTypes = {
    deleteTaskAction: PropTypes.func.isRequired,
  };

  handleAssignTask = () => {};
  handleNewComment = () => {};
  handleDeleteTask = id => {
    const { deleteTaskAction } = this.props;
    deleteTaskAction(id);
  };
  render() {
    return <ListInputContainer />;
  }
}

export default TaskDetail;
