import React from 'react';
import PropTypes from 'prop-types';
import Thumbnail from '../../../../../../Modules/Thumbnail/thumbnail';

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
                  <Thumbnail user={teamMate} />
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
