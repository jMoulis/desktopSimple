import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import TeamWidget from './teamWidget';
import './index.css';

class TeamSelector extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    selectTeam: PropTypes.func.isRequired,
  };

  state = {
    display: true,
    teamId: '',
  };

  handleCloseMe = evt => {
    const { teamid } = evt.currentTarget.dataset;
    this.setState({
      display: false,
      teamId: teamid,
    });
  };

  render() {
    const { loggedUser, selectTeam } = this.props;
    const { teamId } = this.state;
    return (
      <CSSTransition
        in={this.state.display}
        timeout={400}
        classNames="team-selector"
        onExited={() => {
          selectTeam(teamId);
        }}
        appear
      >
        <div className="team-selector">
          <h1>Please select the team you want to load</h1>
          <ul className="ul-nav">
            {loggedUser &&
              loggedUser.teams.map((team, index) => (
                <li
                  className="team-selector-item"
                  key={index}
                  onClick={this.handleCloseMe}
                  onKeyPress={this.handleCloseMe}
                  data-teamid={team._id}
                >
                  <TeamWidget key={index} team={team} />
                </li>
              ))}
          </ul>
        </div>
      </CSSTransition>
    );
  }
}

export default TeamSelector;
