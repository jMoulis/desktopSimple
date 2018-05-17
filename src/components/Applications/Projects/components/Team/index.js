import React from 'react';
import PropTypes from 'prop-types';
import ProjectInfo from '../../containers/Team/projectInfo';
import './index.css';
import NewTeam from '../../containers/Team/newTeam';

const Team = ({ loggedUser, closeFromParent }) => {
  return (
    <div className="team">
      <div className="content content-projectinfo">
        <ProjectInfo />
      </div>
      <div className="content content-newteam">
        <NewTeam loggedUser={loggedUser} closeFromParent={closeFromParent} />
      </div>
    </div>
  );
};

Team.propTypes = {
  loggedUser: PropTypes.object.isRequired,
  closeFromParent: PropTypes.func.isRequired,
};

export default Team;
