import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class TaskList extends React.Component {
  static propTypes = {
    activeTask: PropTypes.object.isRequired,
  };
  handleLinkClicked = evt => {
    const { fetchSingleTaskAction } = this.props;
    const { id } = evt.target.dataset;
    fetchSingleTaskAction(id);
    this.setState(() => ({
      selectedTask: id,
    }));
  };

  render() {
    const { tasks, activeTask } = this.props;
    return (
      <ul className="task-list">
        {tasks &&
          tasks.length !== 0 &&
          tasks.map(task => (
            <li
              className={`task-list-item ${
                task._id === activeTask._id ? 'task-list-item-selected' : ''
              }`}
              key={task._id}
            >
              <button
                data-id={task._id}
                onClick={this.handleLinkClicked}
                onKeyPress={this.handleLinkClicked}
                className="left-navbar-btn"
              >
                {task.title}
              </button>
            </li>
          ))}
      </ul>
    );
  }
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  fetchSingleTaskAction: PropTypes.func.isRequired,
};

export default TaskList;
