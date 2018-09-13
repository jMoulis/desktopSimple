import React from 'react';
import PropTypes from 'prop-types';

const TaskToolbar = ({ assignAction, commentAction, deleteAction, data }) => (
  <ul className="task-toolbar ul-nav">
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={() => commentAction(data._id)}>
        Comment
      </button>
    </li>
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={() => assignAction(data._id)}>
        Assign
      </button>
    </li>
    <li className="task-toolbar-item">
      <button className="btn-toolbar" onClick={() => deleteAction(data._id)}>
        Delete
      </button>
    </li>
  </ul>
);

TaskToolbar.propTypes = {
  assignAction: PropTypes.func.isRequired,
  commentAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
export default TaskToolbar;
