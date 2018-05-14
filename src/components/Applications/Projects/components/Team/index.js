import React from 'react';
import PropTypes from 'prop-types';
import ProjectInfo from '../../containers/Team/projectInfo';
import './index.css';
import NewTeam from '../../containers/Team/newTeam';

const Team = () => {
  return (
    <div className="team">
      <div className="content">
        <ProjectInfo />
      </div>
      <div className="content">
        <NewTeam />
      </div>
      <div className="content">
        <h1>List of subscribers</h1>
      </div>
    </div>
  );
};

export default Team;
