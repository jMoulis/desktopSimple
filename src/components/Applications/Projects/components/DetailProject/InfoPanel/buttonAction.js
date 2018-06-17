import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../Form/button';
import AlreadyProject from './alreadyProject';

const ButtonAction = ({
  globalActions,
  project,
  openCreateTeamModal,
  globalProps,
}) => (
  <div className="teams-container-buttons">
    <div className="teams-container-buttons-item">
      {!globalProps.activeTeamProcess.team.project ?
        <div>
          <div>
            <h2>If you already have a team</h2>
            <Button
              type="button"
              title="Join the project"
              onClick={() => {
                const { editTeamAction, editProjectAction } = globalActions;
                editProjectAction({
                  teams: [
                    ...project.teams,
                    globalProps.activeTeamProcess.team._id,
                  ],
                });
                editTeamAction({
                  project: {
                    value: project._id,
                    changed: true,
                  },
                });
              }}
              data-tab="create-team"
              category="primary"
              style={{
                marginTop: '.5rem',
              }}
            >Add my team
            </Button>
          </div>
          <div className="teams-container-buttons-item">
            <h2>If you don't have a team</h2>
            <Button
              type="button"
              title="Create a team"
              onClick={openCreateTeamModal}
              data-tab="create-team"
              category="primary"
              style={{
                marginTop: '.5rem',
              }}
            >Create a team
            </Button>
          </div>
        </div> :
        <AlreadyProject />
      }
    </div>
  </div>
);

ButtonAction.propTypes = {
  globalActions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  globalProps: PropTypes.object.isRequired,
  openCreateTeamModal: PropTypes.func.isRequired,
};
export default ButtonAction;
