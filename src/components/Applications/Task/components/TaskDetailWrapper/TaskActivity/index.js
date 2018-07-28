import React from 'react';
import PropTypes from 'prop-types';

const TaskActivity = () => (
  <div id="task-activity">
    <ul className="d-flex">
      <li>All</li>
      <li>History</li>
      <li>Comments</li>
    </ul>
    <div>Tab Content</div>
  </div>
);

TaskActivity.propTypes = {};

export default TaskActivity;
