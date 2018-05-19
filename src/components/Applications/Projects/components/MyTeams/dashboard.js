import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.css';

class Dashboard extends React.Component {
  static propTypes = {
    fetchSingleTeamAction: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    activeTeamProcess: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { fetchSingleTeamAction, teamId } = this.props;
    if (teamId) {
      fetchSingleTeamAction(teamId);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { fetchSingleTeamAction, teamId } = this.props;
    if (nextProps.teamId !== teamId) {
      fetchSingleTeamAction(nextProps.teamId);
    }
    return true;
  }
  handleDeleteTeamMate = (evt) => {
    const { userid } = evt.target.dataset;
    const { editTeamAction, activeTeamProcess } = this.props;
    const teamMates = activeTeamProcess.team.users.filter(user => user._id !== userid);
    editTeamAction({ users: teamMates });
  }
  render() {
    const { activeTeamProcess, loggedUser } = this.props;
    const { loading, team } = activeTeamProcess;
    if (loading) {
      return <span />;
    }
    return (
      <main className="my-team-dashboard">
        <h1>{team.name}</h1>
        <div className="my-team-dashboard-manager">
          <span>Project Manager</span>
          <img className="my-team-dashboard-user" src={team.manager.picture} alt="Manager" />
          <p>{team.manager.fullName}</p>
        </div>
        <ul className="my-team-dashboard-users">
          {team.users.map((user, index) => {
            if (user._id === team.manager._id) {
              return null;
            }
              return (
                <li key={index}>
                  <div className="card">
                    <button data-userid={user._id} className="btn-delete" onClick={this.handleDeleteTeamMate}>X</button>
                    <img className="my-team-dashboard-user" src={user.picture} alt="TeamMate" />
                    <p>{user.fullName}</p>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </main>
    );
  }
}

export default Dashboard;
