import React from 'react';
import moment from 'moment';
import UserIconContainer from '../../../../../../Modules/UserIcon';

const TaskInfo = ({ task }) => {
  return (
    <div id="task-info">
      <div>
        <label>Assigned to</label>
        <UserIconContainer user={{ user: task.assign }} name />
      </div>
      <div>
        <label>Author</label>
        <UserIconContainer user={{ user: task.author }} name />
      </div>
      <ul>
        <li>
          <label>Created</label>
          <div>
            {task.createdAt && (
              <span className="small">
                {moment(task.createdAt).format('DD/MM/YYYY hh:mm')}
              </span>
            )}
          </div>
        </li>
        <li>
          <label>Last modification</label>
          <div>
            {task.createdAt && (
              <span className="small">
                {moment(task.updatedAt).format('DD/MM/YYYY hh:mm')}
              </span>
            )}
          </div>
        </li>
        <li>
          <label>Due Date</label>
          <div>
            {task.createdAt && (
              <span className="small">
                {moment(task.dueDate).format('DD/MM/YYYY hh:mm')}
              </span>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TaskInfo;
