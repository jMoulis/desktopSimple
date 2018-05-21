import React from 'react';
import PropTypes from 'prop-types';

import TeamWidget from './teamWidget';
import Button from '../../../../../Form/button';
import './index.css';

const InfoPanel = ({ activeProjectProcess, openCreateTeamModal, user }) => {
  const { project } = activeProjectProcess;
  return (
    <div>
      <div className="teams-container">
        <h1>Teams</h1>
        {project.teams.length === 0 ? <span>No Teams yet</span> : project.teams.map(team => (
          <TeamWidget key={team._id} team={team} />
          ))}
        {/* if the max Team is ok and if the user is a student */}
        {project.teams.length < project.maxTeam &&
          user._id !== project.author._id &&
          <div>
            <Button
              type="button"
              onClick={openCreateTeamModal}
              data-tab="create-team"
              category="primary"
              style={{
                marginTop: '.5rem',
              }}
            >Add my team
            </Button>
          </div>
        }
      </div>
    </div>
  );
};

InfoPanel.propTypes = {
  activeProjectProcess: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  openCreateTeamModal: PropTypes.func,
};

InfoPanel.defaultProps = {
  openCreateTeamModal: null,
};

export default InfoPanel;
