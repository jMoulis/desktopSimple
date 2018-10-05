import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './selectUserPanel.css';

const SelectUserPanel = ({ users, callback }) => {
  return (
    <ul className="select-user-list">
      {users.map(user => (
        <UserIconContainer
          key={user._id}
          user={{ user }}
          name
          callback={callback}
        />
      ))}
      {users.length === 0 && <li>No users</li>}
    </ul>
  );
};

SelectUserPanel.propTypes = {
  users: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
};

export default SelectUserPanel;
