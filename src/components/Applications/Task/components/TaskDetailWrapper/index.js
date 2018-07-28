import React from 'react';
import PropTypes from 'prop-types';

import TaskDetail from './TaskDetail';
import TaskActivity from './TaskActivity';
import TaskInfo from './TaskInfo';

const TaskDetailWrapper = () => (
  <div id="task-detail-wrapper" className="d-flex">
    <div className="task-detail-wrapper-main">
      <TaskDetail />
      <TaskActivity />
    </div>
    <TaskInfo />
  </div>
);

TaskDetailWrapper.propTypes = {};

export default TaskDetailWrapper;
