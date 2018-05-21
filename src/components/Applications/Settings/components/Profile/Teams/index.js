import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const TeamProfile = ({ user }) => {
  return (
    <ul className="ul-nav teams">
      {user.teams.map(team => (
        <li key={team._id} className="team-container">
          <div>
            <h2>{team.name}</h2>
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
