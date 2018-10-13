import React from 'react';
import PropTypes from 'prop-types';

import TaskDetail from '../../containers/TaskDetailWrapper/TaskDetail';
import TaskActivity from '../../containers/TaskDetailWrapper/TaskActivity';
import './index.css';

const TaskDetailWrapper = ({ activeTaskProcess, globalProps }) => (
  <div className="d-flex flex1">
    <div className="task-detail-wrapper flex1">
      <TaskDetail loggedUser={globalProps.loggedUser} />
      <TaskActivity
        task={activeTaskProcess.task}
        loggedUser={globalProps.loggedUser}
      />
    </div>
  </div>
);

TaskDetailWrapper.propTypes = {
  activeTaskProcess: PropTypes.object.isRequired,
  globalProps: PropTypes.object.isRequired,
};

export default TaskDetailWrapper;
