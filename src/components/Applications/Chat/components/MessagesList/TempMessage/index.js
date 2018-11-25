import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import './index.css';

const TempMessage = ({ user }) => {
  return (
    <div className="d-flex flex-align-items-center">
      <UserIconContainer user={{ user }} hideNotificationBadge />
      <div
        className="d-flex flex-column"
        style={{
          fontSize: '.8rem',
        }}
      >
        <div className="d-flex flex-align-items-baseline">
          <span
            style={{
              marginRight: '.5rem',
              fontWeight: 'bold',
            }}
          >
            {user.fullName}
          </span>
          <span className="small">{moment().format('DD/MM/YYYY hh:mm')}</span>
        </div>
        <span className="loading">{user.fullName} is writing a message</span>
      </div>
    </div>
  );
};

TempMessage.propTypes = {};

export default TempMessage;
