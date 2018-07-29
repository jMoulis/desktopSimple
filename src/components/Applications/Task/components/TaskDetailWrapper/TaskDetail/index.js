import React from 'react';
import PropTypes from 'prop-types';

import TaskToolbar from './TaskToolbar';
import TaskDisplayListInput from '../../../containers/TaskDetailWrapper/TaskDetail/TaskDisplayListInput';
import TaskDisplayDocuments from './TaskDisplayDocuments';

const TaskDetail = ({ task }) => (
  <div id="task-detail">
    <h1>{task ? task.title : 'Loading'}</h1>
    <TaskToolbar />
    <TaskDisplayListInput />
    <TaskDisplayDocuments />
  </div>
);

TaskDetail.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TaskDetail;
