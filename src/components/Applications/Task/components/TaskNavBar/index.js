import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const TaskNavBar = ({ onClick }) => {
  return (
    <ul className="task-navbar ul-nav">
      <li>
        <button onClick={onClick}>Create</button>
      </li>
      <li>Display Card</li>
      <li>Display list</li>
    </ul>
  );
};

TaskNavBar.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default TaskNavBar;
