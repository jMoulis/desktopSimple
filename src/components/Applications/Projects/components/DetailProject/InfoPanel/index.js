import React from 'react';
import TeamWidget from './teamWidget';
import './index.css';

const InfoPanel = ({ activeProjectProcess }) => (
  <div>
    <div className="teams-container">
      <h1>Teams</h1>
      {/* activeProjectProcess.project.teams.map(team => <TeamWidget name="Test Team" />) */}
      <TeamWidget name="Test Team" />
      {/* if the max Team is ok and if the user is a student */}
      <div>+ Create a team</div>
    </div>
  </div>
);

export default InfoPanel;
