import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './index.css';
import Button from '../../Form/button';
import UserIcon from '../../../Modules/UserIcon';

const TeamToolbar = ({
  team,
  showSelectTeamPanel,
  showSettings,
  globalActions,
}) => {
  if (team && Object.keys(team).length === 0) {
    return <div className="team-toolbar" />;
  }
  if (!team) {
    return <span />;
  }
  return (
    <CSSTransition in timeout={200} classNames="team-toolbar" appear>
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
            <Button
              category="neutral"
              type="button"
              title="Chats"
              onClick={() => globalActions.startAppAction('Chat')}
            >
              <i className="fas fa-comments fa-2x" />
            </Button>
          </li>
          <li className="team-toolbar-list-item">
            <Button
              category="neutral"
              type="button"
              title="Tasks"
              onClick={() => globalActions.startAppAction('Task')}
            >
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
            <ul className="d-flex">
              {team.users.map((user, index) => (
                <UserIcon key={index} user={user} />
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </CSSTransition>
  );
};

TeamToolbar.propTypes = {
  team: PropTypes.object.isRequired,
  showSelectTeamPanel: PropTypes.func.isRequired,
  showSettings: PropTypes.func.isRequired,
  globalActions: PropTypes.object.isRequired,
};
export default TeamToolbar;
