import React from 'react';
import PropTypes from 'prop-types';
import EditTeam from '../../../containers/Dashboard/TeamSettings/editTeam';
import './teamSettings.css';

class TeamSettings extends React.Component {
  static propTypes = {
    activeTeamProcess: PropTypes.object.isRequired,
  }
  render() {
    const { activeTeamProcess } = this.props;
    const { team } = activeTeamProcess;
    return (
      <div className="team-settings">
        <EditTeam />
      </div>
    )
  }
}

export default TeamSettings;
