import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './userListItem.css';
import TagList from '../../../../../Modules/Tag/tagList';
import Button from '../../../../../components/Form/button';
import CompanyHeader from '../../../../../Modules/CompanyHeader';
import FriendRequestButtonsContainer from '../../../../../Modules/FriendRequestButtons';
import SendMessageForm from '../../../../../Modules/SendFormMessage';

class UserListItem extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };

  state = {
    showMessageForm: false,
  };

  _handleShowMessageForm = () => {
    this.setState(prevState => ({
      showMessageForm: !prevState.showMessageForm,
    }));
  };

  render() {
    const { user, socket, loggedUser } = this.props;
    const { error, showMessageForm } = this.state;
    return (
      <li className="user-item">
        <div className="user-item-header d-flex flex-justify-between">
          <div className="user-item-icon">
            {error && error}
            {user.company ? (
              <CompanyHeader
                user={user}
                classNameContainer="company-header-reset"
              />
            ) : (
              <div className="user-item-user">
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
          {loggedUser._id !== user._id && (
            <div className="user-item-buttons">
              <FriendRequestButtonsContainer user={user} />
              <Button
                category="primary"
                onClick={this._handleShowMessageForm}
                data-type="draft"
                label="Send Message"
                loading={false}
                style={{
                  margin: 0,
                }}
              />
            </div>
          )}
        </div>
        {showMessageForm && (
          <SendMessageForm
            socket={socket}
            loggedUser={loggedUser}
            receiver={user}
            callback={this._handleShowMessageForm}
          />
        )}
      </li>
    );
  }
}

export default UserListItem;
