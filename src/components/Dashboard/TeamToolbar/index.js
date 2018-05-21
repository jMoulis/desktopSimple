import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import Button from '../../Form/button';

class TeamToolbar extends React.Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    showSelectTeamPanel: PropTypes.func.isRequired,
    showSettings: PropTypes.func.isRequired,
  }
  componentDidMount() {}
  showUserDetailModalAction = (evt) => {
    const { showUserDetailModalAction } = this.props;
    const { user } = evt.target.dataset;
    showUserDetailModalAction(user);
  }
  render() {
    const { team, showSelectTeamPanel, showSettings } = this.props;
    return (
      <nav className="team-toolbar">
        <div className="team-toolbar-list-item">
          <Button
            type="button"
            category="neutral"
            dataset-teamid={team._id}
            onClick={showSelectTeamPanel}
            title="Switch Team"
          >
            <i className="fas fa-exchange-alt fa-2x" />
          </Button>
        </div>
        <ul className="ul-nav team-toolbar-list">
          <li className="team-toolbar-list-item">
            <Button category="neutral" type="button" title="Breaking News">
              <i className="far fa-newspaper fa-2x" />
            </Button>
          </li>
          <li className="team-toolbar-list-item">
            <Button category="neutral" type="button" title="Message">
              <i className="far fa-envelope fa-2x" />
            </Button>
          </li>
          <li className="team-toolbar-list-item">
            <Button category="neutral" type="button" title="Tasks">
              <i className="fas fa-tasks fa-2x" />
            </Button>
          </li>
          <li className="team-toolbar-list-item">
            <Button
              category="neutral"
              type="button"
              onClick={showSettings}
              title="Team Settings"
            >
              <i className="fas fa-cog fa-2x" />
            </Button>
          </li>
          <li className="team-list">
            <ul>
              {team.users.map(({ user, spec }, index) => {
                return (
                  <img
                    key={index}
                    data-user={user._id}
                    onClick={this.showUserDetailModalAction}
                    onKeyPress={this.showUserDetailModalAction}
                    className="miniature miniature-smaller"
                    src={user.picture || 'img/avatar.png'}
                    style={spec === 'manager' ? {
                      border: '2px solid #d44c00',
                    } : {
                      border: '2px solid transparent',
                    }}
                    alt="User"
                    title={`${user.fullName} - ${spec}`}
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
