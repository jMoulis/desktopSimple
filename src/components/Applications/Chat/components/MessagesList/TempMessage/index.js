import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const TempMessage = ({ users }) => (
  <li className="typing-message">
    <div className="d-flex flex-align-items-center loading">
      <div className="test">
        {users.map(user => (
          <span>{`${user.fullName}`}</span>
        ))}
      </div>
    </div>
  </li>
);

TempMessage.propTypes = {
  users: PropTypes.array.isRequired,
};

export default TempMessage;
