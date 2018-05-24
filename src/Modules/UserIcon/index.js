import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

// Action from global app... I think it might be a little spaghetti code
import { showUserDetailModalAction } from '../../store/reducers/appReducer';

const mapStateToProps = ({ userReducer, appReducer }) => ({
  userActive: userReducer.userActive,
  userId: appReducer.userId,
});

// Actions
const mapDispatchToProps = dispatch => ({
  showUserDetailModal: (userId) => {
    dispatch(showUserDetailModalAction(userId));
  },
});

const UserIcon = ({
  showUserDetailModal,
  user,
  active,
  classCss,
}) => (
  <img
    className={`mini-thumbnail mini-thumbnail-${classCss}`}
    src={user.user.picture || '/img/avatar.png'}
    alt="Student"
    title={`${user.user.fullName} ${user.spec ? `- ${user.spec}` : ''}`}
    onClick={() => active && showUserDetailModal(user.user._id)}
    onKeyPress={() => active && showUserDetailModal(user.user._id)}
    style={user.spec === 'manager' ? {
      border: '2px solid #d44c00',
    } : {
      border: '2px solid transparent',
    }}
  />
);

UserIcon.propTypes = {
  showUserDetailModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classCss: PropTypes.string,
  active: PropTypes.bool,
};

UserIcon.defaultProps = {
  active: true,
  classCss: '',
};

const createContainer = connect(mapStateToProps, mapDispatchToProps);
const UserIconContainer = createContainer(UserIcon);

export default UserIconContainer;
