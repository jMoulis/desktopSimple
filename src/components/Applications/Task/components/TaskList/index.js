import React from 'react';
import PropTypes from 'prop-types';

const TaskList = ({ tasks, fetchSingleTaskAction }) => (
  <ul id="task-list">
    {tasks &&
      tasks.length !== 0 &&
      tasks.map(task => (
        <li
          key={task._id}
          onClick={() => {
            fetchSingleTaskAction(task._id);
          }}
          onKeyPress={() => {
            fetchSingleTaskAction(task._id);
          }}
        >
          {task.title}
        </li>
      ))}
  </ul>
);

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  fetchSingleTaskAction: PropTypes.func.isRequired,
};

export default TaskList;
