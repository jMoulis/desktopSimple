import React from 'react';
import PropTypes from 'prop-types';

const TeamWidget = ({ team }) => (
  <div>
    <h1>{team.name}</h1>
    <h2>{team.project.title}</h2>
    <ul>
      {team.users.map(({ user }, index) => (
        <li key={index}>
          <div className="user-thumbnail">
            <img src={user.picture} alt="User" />
            <p>{user.fullName}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
TeamWidget.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamWidget;
