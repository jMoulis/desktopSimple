import React from 'react';
import PropTypes from 'prop-types';

const TaskDisplayListInput = props => {
  return (
    <ul>
      {['type', 'status', 'priority', 'solved', 'label', 'description'].map(
        (field, index) => (
          <li key={index}>
            <div>
              <label>{field}</label>
              <input />
            </div>
          </li>
        ),
      )}
    </ul>
  );
};

TaskDisplayListInput.propTypes = {};

export default TaskDisplayListInput;
