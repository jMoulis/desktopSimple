import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import UserIcon from '../../../../../../Modules/UserIcon';

const TeamProfile = ({
  user,
  globalActions,
}) => {
  return (
    <ul className="ul-nav teams">
      <li className="teams-new-team">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            globalActions.startAppAction('Projects');
          }}
        >
        Create Team
        </button>
      </li>
      {user.teams.map(team => (
        <li
          key={team._id}
          className="team-container"
          onClick={() => globalActions.selectTeam(team._id)}
          onKeyPress={() => globalActions.selectTeam(team._id)}
          title="Select Team"
        >
          <div>
            <h2>{team.name}</h2>
            <ul>
              {team.users.map((teamMate, index) => (
                <li key={index}>
                  <UserIcon
                    user={teamMate}
                  />
                  <p>{teamMate.user.fullName}</p>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

TeamProfile.propTypes = {
  user: PropTypes.object.isRequired,
  globalActions: PropTypes.object.isRequired,
};

export default TeamProfile;
