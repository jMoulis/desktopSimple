import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class TeamToolbar extends React.Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    showSelectTeamPanel: PropTypes.func.isRequired,
    showSettings: PropTypes.func.isRequired,
  }
  componentDidMount() {
    
  }
  render() {
    const { team, showSelectTeamPanel, showSettings } = this.props;
    return (
      <nav className="team-toolbar">
        <ul className="ul-nav">
          <li>
            <button
              type="button"
              className="btn"
              dataset-teamid={team._id}
              onClick={showSelectTeamPanel}
            >Switch Team
            </button>
          </li>
          <li>
            <button className="btn" type="button">
              <i className="far fa-newspaper fa-2x" />
            </button>
          </li>
          <li>
            <button className="btn" type="button">
              <i className="far fa-envelope fa-2x" />
            </button>
          </li>
          <li>
            <button className="btn" type="button">
              <i className="fas fa-tasks fa-2x" />
            </button>
          </li>
          <li>
            <button className="btn" type="button" onClick={showSettings}>
              <i className="fas fa-cog fa-2x" />
            </button>
          </li>
          <li>
            <ul>
              {team.users.map(({ user }, index) => {
                return (
                  <img
                    key={index}
                    className="miniature"
                    src={user.picture || 'img/avatar.png'}
                    alt="User"
                  />
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
}


export default TeamToolbar;
