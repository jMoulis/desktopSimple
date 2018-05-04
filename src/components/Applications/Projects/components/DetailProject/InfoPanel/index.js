import React from 'react';
import TeamWidget from './teamWidget';
import './index.css';

const InfoPanel = ({ activeProjectProcess }) => (
  <div>
    <div className="teams-container">
      <h1>Teams</h1>
      {/* activeProjectProcess.project.teams.map(team => <TeamWidget name="Test Team" />) */}
      <TeamWidget name="Test Team" />
    </div>
  </div>
);

export default InfoPanel;
