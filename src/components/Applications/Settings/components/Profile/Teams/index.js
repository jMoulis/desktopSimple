import React from 'react';
import PropTypes from 'prop-types';

const TeamProfile = ({ user }) => {
  return (
    <ul className="ul-nav teams">
      {user.teams.map(team => (
        <li key={team._id} className="team-container">
          <div>
            <span>Team: {team.name}</span>
            <ul>
              {team.users.map((teamMate, index) => (
                <li key={index}>
                  <img className="miniature" src={teamMate.user.picture} alt="user" />
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
};

export default TeamProfile;
