import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../UserIcon';
import './index.css';
import Button from '../../components/Form/button';

const SelectBoxUser = ({ callback, closeFromParent, users }) => {
  return (
    <div>
      {users &&
        users.length > 0 && (
          <div id="selectbox-user">
            <ul className="selectbox-user-list">
              {users.map(({ user }) => (
                <li
                  key={user._id}
                  className="d-flex flex-align-items-center pointer"
                >
                  <Button
                    label="Select"
                    onClick={() => {
                      callback(user);
                      closeFromParent();
                    }}
                  />
                  <UserIconContainer user={{ user }} />
                  <span>{user.fullName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

SelectBoxUser.propTypes = {
  users: PropTypes.array,
  callback: PropTypes.func.isRequired,
  closeFromParent: PropTypes.func,
};
SelectBoxUser.defaultProps = {
  users: null,
  closeFromParent: null,
};

export default SelectBoxUser;
