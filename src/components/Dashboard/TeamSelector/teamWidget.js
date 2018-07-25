import React from 'react';
import PropTypes from 'prop-types';
import UserIcon from '../../../Modules/UserIcon';
import './teamWidget.css';

const TeamWidget = ({ team }) => (
  <div className="selector-team-widget">
    <h1>{team.name}</h1>
    {team.project ?
      <h2>{team.project.title}</h2> :
      <h2>No project selected yet</h2>}
    <ul className="team-widget-users-list">
      {team.users.map((user, index) => {
        if (!user.user) {
          return null;
        }
        return (
          <li key={index}>
            <div className="user-thumbnail">
              <UserIcon
                user={user}
                active={false}
                classCss="middle"
              />
              <p>{user.user && user.user.fullName}</p>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);
TeamWidget.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamWidget;
