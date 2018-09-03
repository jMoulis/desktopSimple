import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const TaskFilter = ({ fetchTasksAction }) => (
  <ul className="left-navbar">
    <li>
      <button
        onClick={() =>
          fetchTasksAction(
            { repository: { filter: '' } },
            {
              filterName: {
                label: 'All',
                type: 'main',
              },
            },
          )
        }
        className="left-navbar-btn"
        type="button"
      >
        All Tasks
      </button>
    </li>
    <li>
      <button
        onClick={() =>
          fetchTasksAction(
            { repository: { myTask: true } },
            {
              filterName: {
                label: 'My Tasks',
                type: 'main',
              },
            },
          )
        }
        className="left-navbar-btn"
        type="button"
      >
        My Tasks
      </button>
    </li>
  </ul>
);

TaskFilter.propTypes = {
  fetchTasksAction: PropTypes.func.isRequired,
};

export default TaskFilter;
