import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../../containers/Profile';
import './settings.css';
import CompanyProfile from '../../containers/Profile/Company';
import AccountProfile from '../../containers/Profile/Account';
import TeamProfile from '../../containers/Profile/Teams';
import NewTeamContainer from '../../containers/Profile/Teams/NewTeam';
import AppToolbar from '../../../../../Modules/AppToolbar';

class Settings extends React.Component {
  static propTypes = {
    globalActions: PropTypes.object,
    globalProps: PropTypes.object.isRequired,
  };
  static defaultProps = {
    globalActions: null,
  };

  state = {
    tab: 'profile',
    subMenu: {},
  };

  componentDidUpdate() {
    if (Object.keys(this.state.subMenu).length !== 0) {
      document.addEventListener('click', this._resetSubMenu);
    }
  }

  handleShowSubMenu = evt => {
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      subMenu: {
        ...prevState.subMenu,
        [name]: !prevState.subMenu[name],
      },
    }));
  };

  handleSuccessCreation = tabName => {
    this.setState(prevState => ({
      ...prevState,
      tab: tabName,
    }));
  };

  handleTabSelect = evt => {
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      tab: name,
      subMenu: {},
    }));
  };

  _resetSubMenu = evt => {
    if (!evt.target.dataset.toggle) {
      this.setState(prevState => ({
        ...prevState,
        subMenu: {},
      }));
    }
  };
  render() {
    const {
      globalProps: { loggedUser },
      globalActions,
    } = this.props;
    const { subMenu } = this.state;
    return (
      <div className="settings-container">
        <AppToolbar
          sortingAction={this.handleAppToolBarSearch}
          menus={[
            {
              label: 'Profile',
              action: this.handleTabSelect,
              name: 'profile',
              show: true,
            },
            {
              label: 'Company',
              action: this.handleTabSelect,
              name: 'company',
              show: loggedUser.typeUser !== 'student',
            },
            {
              label: 'Teams',
              action: this.handleShowSubMenu,
              name: 'newTeam',
              show: loggedUser.typeUser !== 'company',
              showSubMenu: subMenu,
              subMenu: [
                {
                  label: 'Create Team',
                  disabled: false,
                  name: 'newTeam',
                  action: evt => {
                    this.handleTabSelect(evt);
                  },
                },
                {
                  label: 'Teams List',
                  disabled: false,
                  name: 'teams',
                  action: evt => {
                    this.handleTabSelect(evt);
                  },
                },
              ],
            },
            {
              label: 'Touchy Info',
              action: this.handleTabSelect,
              name: 'account',
              show: true,
            },
          ]}
          liStyle={{
            width: '50%',
          }}
        />
        {this.state.tab === 'profile' && (
          <Profile loggedUser={loggedUser} key="profile" />
        )}
        {this.state.tab === 'teams' &&
          loggedUser.typeUser !== 'company' && (
            <TeamProfile key="teams" globalActions={globalActions} />
          )}
        {this.state.tab === 'newTeam' && (
          <NewTeamContainer
            loggedUser={loggedUser}
            onSuccess={this.handleSuccessCreation}
            tabName="teams"
          />
        )}
        {this.state.tab === 'company' && (
          <CompanyProfile loggedUser={loggedUser} key="profile" />
        )}
        {this.state.tab === 'account' && (
          <AccountProfile loggedUser={loggedUser} key="account" />
        )}
      </div>
    );
  }
}

export default Settings;
