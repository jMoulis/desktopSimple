import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import UserIcon from '../../../../../../Modules/UserIcon';

const TeamProfile = ({ user, selectTeam }) => {
  return (
    <ul className="ul-nav teams">
      {user.teams.map(team => (
        <li
          key={team._id}
          className="team-container"
          onClick={() => selectTeam(team._id)}
          onKeyPress={() => selectTeam(team._id)}
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
  selectTeam: PropTypes.func.isRequired,
};

export default TeamProfile;
