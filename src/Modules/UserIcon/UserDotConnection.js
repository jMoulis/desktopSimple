import React from 'react';
import PropTypes from 'prop-types';

import './userDotConnection.css';

const classes = (isSmall, isConnected) => {
  let className = 'user-dot';
  if (isSmall) {
    className = `${className} ${className}-small`;
  }
  if (isConnected) {
    className = `${className} user-dot-connected`;
  }
  return className;
};

const UserDotConnection = ({ isConnected, isSmall }) => {
  return <span className={classes(isSmall, isConnected)} />;
};

UserDotConnection.propTypes = {
  isConnected: PropTypes.bool,
  isSmall: PropTypes.bool,
};

UserDotConnection.defaultProps = {
  isConnected: false,
  isSmall: false,
};

export default UserDotConnection;
