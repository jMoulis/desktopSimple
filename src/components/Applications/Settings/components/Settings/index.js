import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../../containers/Profile';
import './settings.css';
import CompanyProfile from '../../containers/Profile/Company';
import AccountProfile from '../../containers/Profile/Account';

class Settings extends React.Component {
  static propTypes = {
    fetchSingleUserAction: PropTypes.func.isRequired,
    loginProcess: PropTypes.object.isRequired,
    userActive: PropTypes.object.isRequired,
  }
  state = {
    tab: 'profile',
  }
  componentDidMount() {
    const { fetchSingleUserAction, loginProcess } = this.props;
    fetchSingleUserAction(loginProcess.loggedUser.id);
  }
  handleTabSelect = (evt) => {
    // Save the input field
    const { name } = evt.target;
    this.setState(() => ({
      tab: name,
    }));
  }
  render() {
    const { userActive } = this.props;
    const { loading } = userActive;
    if (loading) {
      return <span />;
    }
    return (
      <div className="settings-container">
        <div className="app-toolbar" key="app-toolbar">
          <ul>
            <li><button className="btn-form btn-app-toolbar" name="profile" onClick={this.handleTabSelect}>Profile</button></li>
            {userActive.user.typeUser !== 'student' && <li><button className="btn-form btn-app-toolbar" name="company" onClick={this.handleTabSelect}>Company</button></li>}
            <li><button className="btn-form btn-app-toolbar" name="account" onClick={this.handleTabSelect}>Touchy Info</button></li>
          </ul>
        </div>
        {this.state.tab === 'profile' && <Profile key="profile" />}
        {this.state.tab === 'company' && <CompanyProfile key="profile" />}
        {this.state.tab === 'account' && <AccountProfile key="account" />}
      </div>
    );
  }
}

export default Settings;
