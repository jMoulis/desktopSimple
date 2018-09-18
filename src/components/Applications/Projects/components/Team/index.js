import React from 'react';
import PropTypes from 'prop-types';
import ProjectInfo from '../../containers/Team/projectInfo';
import './index.css';
import NewTeam from '../../containers/Team/newTeam';

const Team = ({ loggedUser, closeOnSuccess }) => {
  return (
    <div className="team">
      <div className="content content-project-info">
        <ProjectInfo />
      </div>
      <div className="content content-newteam">
        <NewTeam loggedUser={loggedUser} closeOnSuccess={closeOnSuccess} />
      </div>
    </div>
  );
};

Team.propTypes = {
  loggedUser: PropTypes.object.isRequired,
  closeOnSuccess: PropTypes.func.isRequired,
};

export default Team;
