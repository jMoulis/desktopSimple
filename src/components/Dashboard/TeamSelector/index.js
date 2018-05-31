import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import TeamWidget from './teamWidget';
import './index.css';

class TeamSelector extends React.Component {
  static propTypes = {
    userActive: PropTypes.object,
    selectTeam: PropTypes.func.isRequired,
  }
  static defaultProps = {
    userActive: null,
  }
  state = {
    display: true,
    teamId: '',
  }
  handleCloseMe = (evt) => {
    const { teamid } = evt.currentTarget.dataset;
    this.setState({
      display: false,
      teamId: teamid,
    });
  }
  render() {
    const { userActive, selectTeam } = this.props;
    const { teamId } = this.state;

    if (userActive.loading) {
      return <span />;
    }
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
          <h1>Please select the board you want to load</h1>
          <ul className="ul-nav">
            {userActive.user.teams.map((team, index) => (
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
