import React from 'react';
import PropTypes from 'prop-types';
import ProjectInfo from '../../containers/Team/projectInfo';
import './index.css';
import NewTeam from '../../containers/Team/newTeam';

const Team = ({ loggedUser, close }) => {
  return (
    <div className="team">
      <div className="content content-projectinfo">
        <ProjectInfo />
      </div>
      <div className="content content-newteam">
        <NewTeam loggedUser={loggedUser} close={close} />
      </div>
    </div>
  );
};

Team.propTypes = {
  loggedUser: PropTypes.object.isRequired,
};

export default Team;
