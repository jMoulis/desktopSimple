import React from 'react';
import PropTypes from 'prop-types';
import './thumbnail.css';

const TeamProfile = ({ teams }) => {
  return (
    <ul className="ul-nav">
      {teams.map(team => (
        <li key={team._id}>
          <div>
            <span>{team.name}</span>
            <ul>
              {team.users.map(user => (
                <li key={user.id}>
                  <div className="thumbnail-container">
                    <img className="thumbnail" src={user.picture} alt="expert" />
                    <span>{user.fullName}</span>
                  </div>
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
  teams: PropTypes.array,
};

TeamProfile.defaultProps = {
  teams: [],
};

export default TeamProfile;
