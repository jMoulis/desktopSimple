import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '../../components/Form/button';
import { sendFriendRequest } from '../../store/reducers/userReducer';

const mapStateToProps = ({ userReducer, authReducer }) => ({
  usersProcess: userReducer.userList,
  loggedUser: authReducer.loginProcess.loggedUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  sendFriendRequestAction: filter => {
    dispatch(sendFriendRequest(filter));
  },
});

class FriendRequestButtons extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    sendFriendRequestAction: PropTypes.func.isRequired,
  };
  isAlreadyRequest = (receivedRequest, key) =>
    receivedRequest.some(request => request === key);
  isFriendRender = () => {
    const { user, loggedUser, sendFriendRequestAction } = this.props;
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
              sendFriendRequestAction({ userId: user._id, type: 'delete' });
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
              sendFriendRequestAction({ userId: user._id, type: 'accept' })
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
              sendFriendRequestAction({ userId: user._id, type: 'decline' })
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
            sendFriendRequestAction({
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
    if (this.isAlreadyRequest(user.declinedRequest, loggedUser._id)) {
      return (
        <div className="d-flex">
          <Button
            category="primary"
            label="Declined"
            loading={false}
            style={{
              margin: 0,
              marginRight: '0.5rem',
            }}
            disabled
          />
          <Button
            category="success"
            onClick={() =>
              sendFriendRequestAction({ userId: user._id, type: 'request' })
            }
            label="Friend request"
            loading={false}
            style={{
              margin: 0,
            }}
          />
        </div>
      );
    }
    return (
      <Button
        category="success"
        onClick={() =>
          sendFriendRequestAction({ userId: user._id, type: 'request' })
        }
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
    return <Fragment>{this.isFriendRender()}</Fragment>;
  }
}

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const FriendRequestButtonsContainer = createContainer(FriendRequestButtons);

export default FriendRequestButtonsContainer;
