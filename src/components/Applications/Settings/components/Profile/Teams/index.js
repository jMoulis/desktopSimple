import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import UserIcon from '../../../../../../Modules/UserIcon';
import Loader from '../../../../../../Modules/Loader';

class TeamProfile extends React.Component {
  static propTypes = {
    globalActions: PropTypes.object.isRequired,
    fetchTeamsAction: PropTypes.func.isRequired,
    teamsProcess: PropTypes.object.isRequired,
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
    const { globalActions, teamsProcess } = this.props;
    const { teams, loading } = teamsProcess;
    if (loading) {
      return <Loader size={60} />;
    }
    return (
      <ul className="ul-nav teams">
        {teams.length > 0 &&
          teams.map(team => (
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
                    team.users.map((teamMate, index) => (
                      <li key={index}>
                        <UserIcon user={teamMate} />
                        <p>{teamMate.user.fullName}</p>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
      </ul>
    );
  }
}

export default TeamProfile;
