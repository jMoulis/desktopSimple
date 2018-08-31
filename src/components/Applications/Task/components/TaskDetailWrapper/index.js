import React from 'react';

import TaskDetail from '../../containers/TaskDetailWrapper/TaskDetail';
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

export default TaskDetailWrapper;
