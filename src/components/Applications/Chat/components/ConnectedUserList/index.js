import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';

class ConnectedUserList extends Component {
  render() {
    const { connectedUsers } = this.props;
    console.log(connectedUsers);
    return (
      <ul>
        {connectedUsers &&
          connectedUsers.map(user => (
            <li>
              <UserIconContainer user={{ user }} name />
            </li>
          ))}
      </ul>
    );
  }
}

ConnectedUserList.propTypes = {};

export default ConnectedUserList;
