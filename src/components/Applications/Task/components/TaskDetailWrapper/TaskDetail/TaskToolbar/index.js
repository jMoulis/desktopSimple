import React from 'react';
import PropTypes from 'prop-types';

const TaskToolbar = ({
  assignAction,
  editAction,
  commentAction,
  closeAction,
}) => (
  <ul className="task-toolbar ul-nav">
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={editAction}>
        Edit
      </button>
    </li>
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={commentAction}>
        Comment
      </button>
    </li>
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={assignAction}>
        Assign
      </button>
    </li>
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={closeAction}>
        Close
      </button>
    </li>
  </ul>
);

TaskToolbar.propTypes = {
  assignAction: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
  commentAction: PropTypes.func.isRequired,
  closeAction: PropTypes.func.isRequired,
};
export default TaskToolbar;
