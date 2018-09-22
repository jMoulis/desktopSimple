import React from 'react';
import PropTypes from 'prop-types';

import TeamWidget from './teamWidget';
import './index.css';
import ButtonAction from './buttonAction';
import NoRoomLeft from './noRoomLeft';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      openCreateTeamModal,
      user,
      globalActions,
      globalProps,
    } = this.props;
    const { activeProjectProcess } = this.props;
    const { project } = activeProjectProcess;
    return (
      <div className="teams-container">
        <h1>Teams</h1>
        {project.teams.length === 0 ? (
          <span>No Teams yet</span>
        ) : (
          project.teams.map((team, index) => (
            <TeamWidget key={index} team={team} />
          ))
        )}
        {/* if the max Team is ok and if the user is a student */}
        {project.teams.length < project.maxTeam &&
          user._id !== project.author._id && (
            <ButtonAction
              globalActions={globalActions}
              openCreateTeamModal={openCreateTeamModal}
              project={project}
              user={user}
              globalProps={globalProps}
            />
          )}
        {project.teams.length === project.maxTeam &&
          user.typeUser !== 'company' && <NoRoomLeft />}
      </div>
    );
  }
}

InfoPanel.propTypes = {
  activeProjectProcess: PropTypes.object.isRequired,
  globalActions: PropTypes.object.isRequired,
  globalProps: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  openCreateTeamModal: PropTypes.func,
};

InfoPanel.defaultProps = {
  openCreateTeamModal: null,
};

export default InfoPanel;
