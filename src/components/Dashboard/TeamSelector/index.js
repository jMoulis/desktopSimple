import React from 'react';
import PropTypes from 'prop-types';
import TeamWidget from './teamWidget';
import './index.css';

class TeamSelector extends React.Component {
  static propTypes = {
    userActive: PropTypes.object,
    selectTeam: PropTypes.func.isRequired,
    fetchUserAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  }
  static defaultProps = {
    userActive: null,
  }
  componentDidMount() {
    const { fetchUserAction, loggedUser } = this.props;
    fetchUserAction(loggedUser._id);
  }
  render() {
    const { userActive, selectTeam } = this.props;
    if (userActive.loading) {
      return <span>Loading</span>;
    }
    return (
      <div className="team-selector">
        <h1>Please select the board you want to load</h1>
        <ul className="ul-nav">
          {userActive.user.teams.map((team, index) => (
            <li
              className="team-selector-item"
              key={index}
              onClick={selectTeam}
              onKeyPress={selectTeam}
              data-teamid={team._id}
            >
              <TeamWidget key={index} team={team} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}


export default TeamSelector;
