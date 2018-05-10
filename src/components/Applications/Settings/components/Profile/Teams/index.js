import React from 'react';
import PropTypes from 'prop-types';
import './thumbnail.css';

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
                  <div className="thumbnail-container">
                    <img className="thumbnail" src={teamMate.picture} alt="expert" />
                    <span>{teamMate.fullName}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {team.manager === user._id && <button type="button">Modify</button>}
        </li>
      ))}
    </ul>
  );
};

TeamProfile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default TeamProfile;
