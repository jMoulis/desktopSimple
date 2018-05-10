import React from 'react';
import PropTypes from 'prop-types';

import './teamWidget.css';

const TeamWidget = ({ team }) => {
  return (
    <div className="team-widget">
      <div className="mini-container">
        {team.users.map(user => <img key={user._id} className="mini-thumbnail" src={user.picture} alt="Student" />)}
      </div>
      <h2>{team.name}</h2>
      <div>Notation</div>
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
