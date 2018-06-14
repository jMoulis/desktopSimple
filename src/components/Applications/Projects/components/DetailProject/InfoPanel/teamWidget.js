import React from 'react';
import PropTypes from 'prop-types';

import './teamWidget.css';
import UserIcon from '../../../../../../Modules/UserIcon';

const TeamWidget = ({ team }) => (
  <div className="team-widget">
    <div className="mini-container">
      {team.users.map((user, index) => {
        if (!user.user) {
          return null;
        }
        return (
          <UserIcon
            key={index}
            user={user}
          />
        );
      })}
    </div>
    <div className="team-widget-content">
      <h2>{team.name}</h2>
      <div className="team-widget-score">
          Score by stars or number?
      </div>
    </div>
  </div>
);

TeamWidget.propTypes = {
  team: PropTypes.object,
};

TeamWidget.defaultProps = {
  team: {},
};

export default TeamWidget;
