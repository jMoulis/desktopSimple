import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTask: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tasks && props.tasks.length > 0 && !state.selectedTask) {
      return {
        ...state,
        selectedTask: props.tasks[0]._id,
      };
    }
    return {
      ...state,
    };
  }

  handleLinkClicked = evt => {
    const { fetchSingleTaskAction } = this.props;
    const { id } = evt.target.dataset;
    fetchSingleTaskAction(id);
    this.setState(() => ({
      selectedTask: id,
    }));
  };

  render() {
    const { tasks } = this.props;
    const { selectedTask } = this.state;
    return (
      <ul className="task-list">
        {tasks &&
          tasks.length !== 0 &&
          tasks.map(task => (
            <li
              className={`task-list-item ${
                task._id === selectedTask ? 'task-list-item-selected' : ''
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
