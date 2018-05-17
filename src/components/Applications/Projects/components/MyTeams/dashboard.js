import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.css';

class Dashboard extends React.Component {
  static propTypes = {
    fetchSingleTeamAction: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    activeTeamProcess: PropTypes.object.isRequired,
  }
  state = {}
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
  render() {
    const { activeTeamProcess } = this.props;
    const { loading, team } = activeTeamProcess;
    if (loading) {
      return <span />;
    }
    return (
      <main className="my-project-dashboard">
        <h1>{team.name}</h1>
      </main>
    );
  }
}

export default Dashboard;
