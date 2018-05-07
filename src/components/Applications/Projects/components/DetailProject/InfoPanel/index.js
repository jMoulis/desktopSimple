import React from 'react';
import TeamWidget from './teamWidget';
import './index.css';

const InfoPanel = ({ activeProjectProcess, selectTab }) => {
  return (
    <div>
      <div className="teams-container">
        <h1>Teams</h1>
        {/* activeProjectProcess.project.teams.map(team => <TeamWidget name="Test Team" />) */}
        <TeamWidget name="Test Team" />
        {/* if the max Team is ok and if the user is a student */}
        <div>
          <button
            type="button"
            onClick={selectTab}
            data-tab="create-team"
          >+ Create a team
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
