import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../../containers/Profile';
import './settings.css';
import CompanyProfile from '../../containers/Profile/Company';
import AccountProfile from '../../containers/Profile/Account';
import TeamProfile from '../../containers/Profile/Teams';

class Settings extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    globalActions: PropTypes.object,
  }
  static defaultProps = {
    globalActions: null,
  }
  state = {
    tab: 'profile',
  }

  handleTabSelect = (evt) => {
    // Save the input field
    const { name } = evt.target;
    this.setState(() => ({
      tab: name,
    }));
  }
  render() {
    const { loggedUser, globalActions } = this.props;
    return (
      <div className="settings-container">
        <div className="app-toolbar" key="app-toolbar">
          <ul>
            <li>
              <button
                className="btn-app-toolbar unselectable"
                name="profile"
                onClick={this.handleTabSelect}
              >Profile
              </button>
            </li>
            {loggedUser.typeUser !== 'student' &&
              <li>
                <button
                  className="btn-app-toolbar unselectable"
                  name="company"
                  onClick={this.handleTabSelect}
                >Company
                </button>
              </li>}
            {loggedUser.typeUser !== 'company' &&
              <li>
                <button
                  className="btn-app-toolbar unselectable"
                  name="teams"
                  onClick={this.handleTabSelect}
                >Teams
                </button>
              </li>
            }
            <li>
              <button
                className="btn-app-toolbar unselectable"
                name="account"
                onClick={this.handleTabSelect}
              >Touchy Info
              </button>
            </li>
          </ul>
        </div>
        {this.state.tab === 'profile' &&
          <Profile key="profile" />}
        {this.state.tab === 'teams' &&
          loggedUser.typeUser !== 'company' &&
          <TeamProfile
            key="teams"
            loggedUser={loggedUser}
            globalActions={globalActions}
          />}
        {this.state.tab === 'company' &&
          <CompanyProfile
            key="profile"
          />}
        {this.state.tab === 'account' &&
          <AccountProfile
            key="account"
          />}
      </div>
    );
  }
}

export default Settings;
