import React from 'react';
import PropTypes from 'prop-types';
import TaskToolbar from './TaskToolbar';
import TaskDisplayListInput from './TaskDisplayListInput';
import TaskDisplayDocuments from './TaskDisplayDocuments';

const TaskDetail = props => {
  return (
    <div id="task-detail">
      <h1>Task Title</h1>
      <TaskToolbar />
      <TaskDisplayListInput />
      <TaskDisplayDocuments />
    </div>
  );
};

TaskDetail.propTypes = {};

export default TaskDetail;
