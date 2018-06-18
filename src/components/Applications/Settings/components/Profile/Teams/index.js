import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import Modal from '../../../../../../Modules/Modal/modal';
import UserIcon from '../../../../../../Modules/UserIcon';
import NewTeamContainer from '../../../containers/Profile/Teams/NewTeam';
import Loader from '../../../../../../Modules/Loader';

class TeamProfile extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    fetchTeamsAction: PropTypes.func.isRequired,
    teamsProcess: PropTypes.object.isRequired,
  }
  state = {
    showAddTeamModal: false,
  }
  componentDidMount() {
    const { fetchTeamsAction } = this.props;
    fetchTeamsAction();
  }
  handleShowAddTeamModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showAddTeamModal: !prevState.showAddTeamModal,
    }));
  }
  render() {
    const { loggedUser, globalActions, teamsProcess } = this.props;
    const { teams, loading } = teamsProcess;
    if (loading) {
      return <Loader size={60} />;
    }
    return (
      <div>
        <ul className="ul-nav teams">
          <li className="teams-new-team">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleShowAddTeamModal}
            >
              Create Team
            </button>
          </li>
          {teams.map(team => (
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
                  {team.users.map((teamMate, index) => (
                    <li key={index}>
                      <UserIcon
                        user={teamMate}
                      />
                      <p>{teamMate.user.fullName}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        {this.state.showAddTeamModal &&
          <Modal
            closeFromParent={this.handleShowAddTeamModal}
            zIndex={300}
            name="Create a team"
            title="Create a team"
          >
            <NewTeamContainer loggedUser={loggedUser} />
          </Modal>}
      </div>
    );
  }
}

export default TeamProfile;
