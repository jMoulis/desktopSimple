import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../../containers/Profile';
import './settings.css';
import CompanyProfile from '../../containers/Profile/Company';
import AccountProfile from '../../containers/Profile/Account';
import TeamProfile from '../../containers/Profile/Teams';
import SubMenu from '../../../../../Modules/Submenu';
import NewTeamContainer from '../../containers/Profile/Teams/NewTeam';

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
    subMenu: {},
  }

  componentDidUpdate() {
    if (Object.keys(this.state.subMenu).length !== 0) {
      document.addEventListener('click', this._resetSubMenu );
    }
  }
  handleShowSubMenu = (evt) => {
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      subMenu: {
        ...prevState.subMenu,
        [name]: !prevState.subMenu[name],
      },
    }));
  }

  handleTabSelect = (evt) => {
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      tab: name,
      subMenu: {},
    }));
  }
  _resetSubMenu = (evt) => {
    if (!evt.target.dataset.toggle) {
      this.setState(prevState => ({
        ...prevState,
        subMenu: {},
      }));
    }
  }
  render() {
    const { loggedUser, globalActions } = this.props;
    const { subMenu } = this.state;
    return (
      <div className="settings-container">
        <div className="app-toolbar" key="app-toolbar">
          <ul className="app-toolbar-list">
            <li className="app-toolbar-list-item">
              <button
                className="btn-app-toolbar unselectable"
                name="profile"
                onClick={this.handleTabSelect}
              >Profile
              </button>
            </li>
            {loggedUser.typeUser !== 'student' &&
              <li className="app-toolbar-list-item">
                <button
                  className="btn-app-toolbar unselectable"
                  data-toggle="toggle"
                  name="company"
                  onClick={this.handleTabSelect}
                >Company
                </button>
              </li>}
            {loggedUser.typeUser !== 'company' &&
              <li className="app-toolbar-list-item">
                <button
                  className="btn-app-toolbar unselectable"
                  data-toggle="toggle"
                  name="newTeam"
                  onClick={this.handleShowSubMenu}
                >Teams
                </button>
                {subMenu.newTeam && <SubMenu
                  menus={[
                    {
                      label: 'Create Team',
                      disabled: false,
                      name: 'newTeam',
                      action: (evt) => {
                        this.handleTabSelect(evt);
                      },
                    },
                    {
                      label: 'Teams List',
                      disabled: false,
                      name: 'teams',
                      action: (evt) => {
                        this.handleTabSelect(evt);
                      },
                    },
                  ]}
                />}
              </li>
            }
            <li className="app-toolbar-list-item">
              <button
                className="btn-app-toolbar unselectable"
                name="account"
                data-toggle="toggle"
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
        {this.state.tab === 'newTeam' &&
          <NewTeamContainer loggedUser={loggedUser} />
        }
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
