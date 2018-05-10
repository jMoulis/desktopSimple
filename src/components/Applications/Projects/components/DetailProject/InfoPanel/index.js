import React from 'react';
import TeamWidget from './teamWidget';
import './index.css';

const InfoPanel = ({ activeProjectProcess, selectTab }) => {
  const { project } = activeProjectProcess;
  return (
    <div>
      <div className="teams-container">
        <h1>Teams</h1>
        {project.teams.map(team => (
          <TeamWidget key={team._id} team={team} />
          ))}
        {/* if the max Team is ok and if the user is a student */}
        {project.teams.length < project.maxTeam &&
          <div>
            <button
              type="button"
              onClick={selectTab}
              data-tab="create-team"
            >+ Create a team
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default InfoPanel;
