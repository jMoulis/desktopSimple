import React from 'react';
import PropTypes from 'prop-types';

import './teamWidget.css';

const TeamWidget = ({ team }) => {
  return (
    <div className="team-widget">
      <div className="mini-container">
        {team.users.map(({ user }, index) => (
          <img
            key={index}
            className="mini-thumbnail"
            src={user.picture || '/img/avatar.png'}
            alt="Student"
            title={user.fullName}
          />
        ))}
      </div>
      <div className="team-widget-content">
        <h2>{team.name}</h2>
        <div className="team-widget-score">
            Score by stars or number?
        </div>
      </div>
    </div>
  );
};

TeamWidget.propTypes = {
  team: PropTypes.object,
};

TeamWidget.defaultProps = {
  team: {},
};

export default TeamWidget;
