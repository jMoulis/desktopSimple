import React from 'react';
import PropTypes from 'prop-types';

const TaskToolbar = () => (
  <ul className="ul-nav">
    <li>Edit</li>
    <li>Comment</li>
    <li>Assign</li>
    <li>Cancel</li>
    <li>Start</li>
  </ul>
);

TaskToolbar.propTypes = {};

export default TaskToolbar;