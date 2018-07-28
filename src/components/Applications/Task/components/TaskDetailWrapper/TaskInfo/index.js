import React from 'react';
import PropTypes from 'prop-types';

const TaskInfo = () => (
  <div id="task-info">
    <div>
      <label>Assigned to</label>
      <div>User</div>
    </div>
    <div>
      <label>Author</label>
      <div>User</div>
    </div>
    <ul>
      <li>
        <label>Created</label>
        <div>date</div>
      </li>
      <li>
        <label>Last modification</label>
        <div>date</div>
      </li>
      <li>
        <label>Due</label>
        <div>date</div>
      </li>
    </ul>
  </div>
);

TaskInfo.propTypes = {};

export default TaskInfo;
