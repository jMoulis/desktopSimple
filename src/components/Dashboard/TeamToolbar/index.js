import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './index.css';
import Button from '../../Form/button';
import UserIcon from '../../../Modules/UserIcon';

class TeamToolbar extends React.Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    showSelectTeamPanel: PropTypes.func.isRequired,
    showSettings: PropTypes.func.isRequired,
  }
  componentDidMount() {}
  render() {
    const { team, showSelectTeamPanel, showSettings } = this.props;
    if (Object.keys(team).length === 0) {
      return <div className="team-toolbar" />;
    }
    return (
      <CSSTransition
        in
        timeout={200}
        classNames="team-toolbar"
        appear
      >
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
                {team.users.map((user, index) => {
                  return (
                    <UserIcon
                      key={index}
                      user={user}
                    />
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </CSSTransition>
    );
  }
}


export default TeamToolbar;
