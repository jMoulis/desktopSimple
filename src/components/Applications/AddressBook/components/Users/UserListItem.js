import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './userListItem.css';
import TagList from '../../../../../Modules/Tag/tagList';
import Button from '../../../../../components/Form/button';
import CompanyHeader from '../../../../../Modules/CompanyHeader';

class UserListItem extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    sendFriendRequest: PropTypes.func.isRequired,
  };
  state = {};
  handleFriendRequest = user => {
    const { sendFriendRequest, loggedUser } = this.props;
    if (this.isAlreadyRequest(user.receivedRequest, loggedUser._id)) {
      return sendFriendRequest({ userId: user._id, type: 'cancel' });
    }
    return sendFriendRequest({ userId: user._id, type: 'request' });
  };

  isAlreadyRequest = (receivedRequest, key) =>
    receivedRequest.some(request => request === key);

  render() {
    const { user, loggedUser } = this.props;
    return (
      <li className="user-item">
        <div>
          {user.company ? (
            <CompanyHeader
              user={user}
              classNameContainer="company-header-reset"
            />
          ) : (
            <div className="user-item-header">
              <UserIconContainer user={{ user }} classCss="middle" />
              <div className="d-flex flex-column">
                <span>{user.fullName}</span>
              </div>
            </div>
          )}
          <p>{user.school && `School: ${user.school}`}</p>
          <p>{user.location && `Location: ${user.location}`}</p>
          <div className="user-item-content">
            <TagList tags={user.company ? user.company.tags : user.tags} />
          </div>
        </div>
        <div className="user-item-footer">
          <Button
            category="primary"
            onClick={() => this.handleFriendRequest(user)}
            label={
              this.isAlreadyRequest(user.receivedRequest, loggedUser._id)
                ? 'Cancel Request'
                : 'Friend request'
            }
            loading={false}
            style={{
              margin: 0,
              marginRight: '0.5rem',
              minWidth: '136px',
            }}
          />
          <Button
            category="primary"
            onClick={this.handleSubmit}
            data-type="draft"
            label="Send Message"
            loading={false}
            style={{
              margin: 0,
            }}
          />
        </div>
      </li>
    );
  }
}

export default UserListItem;
