import React from 'react';
import PropTypes from 'prop-types';
import './leftPanel.css';

class LeftPanel extends React.Component {
  handleShowTeamDetail = () => {
    console.log('click')
  }
  render() {
    const { teamListProcess, showDetail } = this.props;
    return (
      <aside className="my-team-leftpanel">
        <h1>My Teams</h1>
        <ul>
          {teamListProcess.teams.map((team, index) => (
            <li key={index}>
              <div
                className="my-team-leftpanel-content"
                onClick={showDetail}
                onKeyPress={showDetail}
                data-teamid={team._id}
              >
                {team.users.map((user, idx) => (
                  <img
                    key={idx}
                    className="mini-thumbnail"
                    src={user.picture || '/img/avatar.png'}
                    alt="Student"
                  />))}
              </div>
              <h2>{team.name}</h2>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}

LeftPanel.propTypes = {
  teamListProcess: PropTypes.object.isRequired,
};

export default LeftPanel;
