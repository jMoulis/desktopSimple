import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import UserIcon from '../../../../../../Modules/UserIcon';

class TeamProfile extends React.Component {
  static propTypes = {
    globalActions: PropTypes.object.isRequired,
    teamListProcess: PropTypes.object.isRequired,
    fetchTeamsAction: PropTypes.func.isRequired,
  };

  state = {
    showAddTeamModal: false,
  };

  componentDidMount() {
    const { fetchTeamsAction } = this.props;
    fetchTeamsAction();
  }
  handleShowAddTeamModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showAddTeamModal: !prevState.showAddTeamModal,
    }));
  };
  render() {
    const { globalActions, teamListProcess } = this.props;
    if (teamListProcess.loading) {
      return <span />;
    }
    return (
      <ul className="ul-nav teams">
        {teamListProcess.teams &&
          teamListProcess.teams.map(team => (
            <li
              key={team._id}
              className="team-container"
              onClick={() => globalActions.selectTeam(team._id)}
              onKeyPress={() => globalActions.selectTeam(team._id)}
              title="Select Team"
            >
              <div>
                <h2>{team.name}</h2>
                <ul>
                  {team.users.length > 0 &&
                    team.users.map((teamMate, index) => {
                      if (teamMate && teamMate.user)
                        return (
                          <li key={index}>
                            <UserIcon user={teamMate} />
                            <p>{teamMate.user.fullName}</p>
                          </li>
                        );
                      return null;
                    })}
                </ul>
              </div>
            </li>
          ))}
      </ul>
    );
  }
}

export default TeamProfile;
