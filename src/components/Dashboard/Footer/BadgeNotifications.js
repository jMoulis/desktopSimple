import React from 'react';
import PropTypes from 'prop-types';
import './badgeNotifications.css';

const BadgeNotifications = ({ count, style }) => {
  return (
    <span style={style} className="badge-notifications">
      {count}
    </span>
  );
};

BadgeNotifications.propTypes = {
  count: PropTypes.number.isRequired,
  style: PropTypes.object,
};

BadgeNotifications.defaultProps = {
  style: null,
};

export default BadgeNotifications;
