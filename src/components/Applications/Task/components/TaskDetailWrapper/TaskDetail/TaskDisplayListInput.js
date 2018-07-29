import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const TaskDisplayListInput = ({ task }) => (
  <Fragment>
    {!task ? (
      <div>Loading</div>
    ) : (
      <ul>
        <li>
          <label>Type:</label> {task.type}
        </li>
        <li>
          <label>Status:</label>
          {task.status}
        </li>
        <li>
          <label>Priority:</label>
          {task.priority}
        </li>
        <li>
          <label>Labels:</label>
          {task.label}
        </li>
        <li>
          <label>Description:</label>
          {task.description}
        </li>
      </ul>
    )}
  </Fragment>
);

TaskDisplayListInput.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TaskDisplayListInput;
