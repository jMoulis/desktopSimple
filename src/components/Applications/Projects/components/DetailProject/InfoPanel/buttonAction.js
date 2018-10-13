import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../Form/button';
import AlreadyProject from './alreadyProject';
import './buttonAction.css';

const ButtonAction = ({
  globalActions,
  project,
  openCreateTeamModal,
  globalProps,
}) => (
  <Fragment>
    {!globalProps.activeTeamProcess.team.project ? (
      <div className="teams-container-buttons">
        <h1>Want to join the project?</h1>
        <div className="teams-container-buttons-item">
          {globalProps.loggedUser &&
          globalProps.loggedUser.teams &&
          globalProps.loggedUser.teams.length === 0 ? (
            <h2>You don't have a team yet. So you have to create one first</h2>
          ) : (
            <h2>If you already have a team</h2>
          )}

          <Button
            type="button"
            title="Join the project"
            disabled={
              globalProps.loggedUser &&
              globalProps.loggedUser.teams &&
              globalProps.loggedUser.teams.length === 0
            }
            onClick={() => {
              const { editTeamAction, editProjectAction } = globalActions;
              editProjectAction({
                teams: {
                  changed: true,
                  value: [...project.teams, globalProps.activeTeamProcess.team],
                },
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
          >
            Join the project
          </Button>
        </div>
        <div className="teams-container-buttons-item">
          {globalProps.loggedUser &&
          globalProps.loggedUser.teams &&
          globalProps.loggedUser.teams.length === 0 ? (
            <h2>To participate create a team</h2>
          ) : (
            <h2>If you don't have a team for this project</h2>
          )}
          <Button
            type="button"
            title="Create a team"
            onClick={openCreateTeamModal}
            data-tab="create-team"
            category="primary"
            style={{
              marginTop: '.5rem',
            }}
          >
            Create a team
          </Button>
        </div>
      </div>
    ) : (
      <AlreadyProject />
    )}
  </Fragment>
);

ButtonAction.propTypes = {
  globalActions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  globalProps: PropTypes.object.isRequired,
  openCreateTeamModal: PropTypes.func.isRequired,
};
export default ButtonAction;
