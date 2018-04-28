import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../../containers/Profile';

class Settings extends React.Component {
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
    return (
      <div>
        <div className="app-toolbar" key="app-toolbar">
          <ul>
            <li><button className="btn-form btn-app-toolbar" name="profile" onClick={this.handleTabSelect}>Profile</button></li>
            <li><button className="btn-form btn-app-toolbar" name="account" onClick={this.handleTabSelect}>Account</button></li>
          </ul>
        </div>
        {this.state.tab === 'profile' && <Profile key="profile" />}
      </div>
    );
  }
}

export default Settings;
