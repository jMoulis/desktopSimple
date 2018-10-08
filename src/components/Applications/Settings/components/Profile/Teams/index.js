import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import UserIcon from '../../../../../../Modules/UserIcon';

class TeamProfile extends React.Component {
  static propTypes = {
    globalActions: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };

  state = {
    showAddTeamModal: false,
  };

  handleShowAddTeamModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showAddTeamModal: !prevState.showAddTeamModal,
    }));
  };
  render() {
    const { globalActions, loggedUser } = this.props;
    return (
      <ul className="ul-nav teams">
        {loggedUser &&
          loggedUser.teams.length > 0 &&
          loggedUser.teams.map(team => (
            <li
              key={team._id}
              className="team-container"
              onClick={() => globalActions.selectTeam(team._id)}
              onKeyPress={() => globalActions.selectTeam(team._id)}
              title="Select Team"
            >
              <div>
                <h2>{team.name}</h2>
                <ul>
                  {team.users.length > 0 &&
                    team.users.map((teamMate, index) => {
                      if (teamMate && teamMate.user)
                        return (
                          <li key={index}>
                            <UserIcon user={teamMate} />
                            <p>{teamMate.user.fullName}</p>
                          </li>
                        );
                    })}
                </ul>
              </div>
            </li>
          ))}
      </ul>
    );
  }
}

export default TeamProfile;
