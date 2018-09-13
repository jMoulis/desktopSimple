import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserIconContainer from '../UserIcon';
import './index.css';
import Button from '../../components/Form/button';

const mapStateToProps = ({ mainTeamReducer }) => ({
  userList: mainTeamReducer.activeTeamProcess.team.users,
});

const SelectBoxUser = ({ userList, callback, closeFromParent }) => (
  <div>
    <div id="selectbox-user">
      <ul className="selectbox-user-list">
        {userList.map(({ user }) => (
          <li key={user._id} className="d-flex flex-align-items-center pointer">
            <Button
              label="Select"
              onClick={() => {
                callback(user._id);
                closeFromParent();
              }}
            />
            <UserIconContainer user={{ user }} />
            <span>{user.fullName}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

SelectBoxUser.propTypes = {
  userList: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  closeFromParent: PropTypes.func.isRequired,
};
const createContainer = connect(
  mapStateToProps,
  null,
);
const SelectBoxUserContainer = createContainer(SelectBoxUser);

export default SelectBoxUserContainer;
