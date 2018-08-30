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

  isFriendRender = (friends, loggedUser) => {
    if (this.isAlreadyRequest(friends, loggedUser)) {
      return (
        <Button
          category="normal"
          label="Friend"
          loading={false}
          style={{
            margin: 0,
            marginRight: '0.5rem',
            minWidth: '136px',
          }}
          disabled
        />
      );
    }
  };
  isFriendRender = () => {
    const { user, loggedUser, sendFriendRequest } = this.props;
    if (this.isAlreadyRequest(user.friends, loggedUser._id)) {
      return (
        <div>
          <Button
            category="danger"
            label="Delete relation"
            loading={false}
            style={{
              margin: 0,
              marginRight: '0.5rem',
              minWidth: '136px',
            }}
            onClick={() => {
              sendFriendRequest({ userId: user._id, type: 'delete' });
            }}
          />
        </div>
      );
    }
    if (this.isAlreadyRequest(user.sentRequest, loggedUser._id)) {
      return (
        <div className="d-flex">
          <Button
            category="success"
            onClick={() =>
              sendFriendRequest({ userId: user._id, type: 'accept' })
            }
            label="Accept"
            loading={false}
            style={{
              margin: 0,
              marginRight: '0.5rem',
            }}
          />
          <Button
            category="danger"
            onClick={() =>
              sendFriendRequest({ userId: user._id, type: 'decline' })
            }
            label="Decline"
            loading={false}
            style={{
              margin: 0,
            }}
          />
        </div>
      );
    }
    if (this.isAlreadyRequest(user.receivedRequest, loggedUser._id)) {
      return (
        <Button
          category="danger"
          onClick={() =>
            sendFriendRequest({
              userId: user._id,
              type: 'cancel',
            })
          }
          label="Cancel Request"
          loading={false}
          style={{
            margin: 0,
            marginRight: '0.5rem',
            minWidth: '136px',
          }}
          disabled={user._id === loggedUser._id}
        />
      );
    }
    return (
      <Button
        category="success"
        onClick={() => sendFriendRequest({ userId: user._id, type: 'request' })}
        label="Friend request"
        loading={false}
        style={{
          margin: 0,
          marginRight: '0.5rem',
          minWidth: '136px',
        }}
        disabled={user._id === loggedUser._id}
      />
    );
  };
  render() {
    const { user } = this.props;
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
          {this.isFriendRender()}
          {/* {this.isAlreadyRequest(user.sentRequest, loggedUser._id) ? (
            <div className="d-flex">
              <Button
                category="success"
                onClick={() =>
                  sendFriendRequest({ userId: user._id, type: 'accept' })
                }
                label="Accept"
                loading={false}
                style={{
                  margin: 0,
                  marginRight: '0.5rem',
                }}
              />
              <Button
                category="danger"
                onClick={() =>
                  sendFriendRequest({ userId: user._id, type: 'decline' })
                }
                label="Decline"
                loading={false}
                style={{
                  margin: 0,
                }}
              />
            </div>
          ) : (
            <Button
              category="primary"
              onClick={() => {
                if (
                  this.isAlreadyRequest(user.receivedRequest, loggedUser._id)
                ) {
                  return sendFriendRequest({
                    userId: user._id,
                    type: 'cancel',
                  });
                }
                return sendFriendRequest({ userId: user._id, type: 'request' });
              }}
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
          )} */}
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
