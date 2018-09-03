import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

// Action from global app... I think it might be a little spaghetti code
import { showUserDetailModalAction } from '../../store/reducers/appReducer';

// Actions
const mapDispatchToProps = dispatch => ({
  showUserDetailModal: userId => {
    dispatch(showUserDetailModalAction(userId));
  },
});

const UserIcon = ({
  showUserDetailModal,
  user,
  active,
  classCss,
  name,
  containerCss,
}) => {
  if (!user.user) {
    return null;
  }
  return (
    <div className="d-flex flex-align-items-center" style={containerCss}>
      <img
        className={`mini-thumbnail mini-thumbnail-${classCss}`}
        src={user.user.picture || '/img/avatar.png'}
        alt="Student"
        title={`${user.user.fullName} ${user.spec ? `- ${user.spec}` : ''}`}
        onClick={() => active && showUserDetailModal(user.user._id)}
        onKeyPress={() => active && showUserDetailModal(user.user._id)}
        style={
          user.spec === 'manager'
            ? {
                border: '2px solid #d44c00',
              }
            : {
                border: '2px solid transparent',
              }
        }
      />
      {name && <span>{user.user.fullName}</span>}
    </div>
  );
};

UserIcon.propTypes = {
  showUserDetailModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classCss: PropTypes.string,
  containerCss: PropTypes.object,
  active: PropTypes.bool,
  name: PropTypes.bool,
};

UserIcon.defaultProps = {
  active: true,
  classCss: '',
  containerCss: null,
  name: false,
};

const createContainer = connect(
  null,
  mapDispatchToProps,
);
const UserIconContainer = createContainer(UserIcon);

export default UserIconContainer;
