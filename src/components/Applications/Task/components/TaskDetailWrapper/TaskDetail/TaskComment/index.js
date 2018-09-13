import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import TaskCommentForm from '../../../../containers/TaskDetailWrapper/TaskDetail/TaskComment/TaskCommentForm';

const TaskComment = ({ comments }) => {
  return (
    <div>
      <TaskCommentForm />
      {comments &&
        comments.map(comment => (
          <li>
            <div>Comment header</div>
            <div>comment content</div>
          </li>
        ))}
    </div>
  );
};

TaskComment.propTypes = {};

export default TaskComment;
