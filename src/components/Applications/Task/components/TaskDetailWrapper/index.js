import React from 'react';
import PropTypes from 'prop-types';

import TaskDetail from './TaskDetail';
import TaskActivity from './TaskActivity';
import TaskInfo from './TaskInfo';
import './index.css';

const TaskDetailWrapper = ({ activeTaskProcess }) => (
  <div className="d-flex flex1">
    <div className="task-detail-wrapper flex1">
      <TaskDetail task={activeTaskProcess.task} />
      <TaskActivity task={activeTaskProcess.task} />
    </div>
    <TaskInfo />
  </div>
);

TaskDetailWrapper.propTypes = {
  activeTaskProcess: PropTypes.object.isRequired,
};

export default TaskDetailWrapper;
