import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './userListItem.css';
import TagList from '../../../../../Modules/Tag/tagList';
import Button from '../../../../../components/Form/button';
import CompanyHeader from '../../../../../Modules/CompanyHeader';
import FriendRequestButtonsContainer from '../../../../../Modules/FriendRequestButtons';
import ChatBoxForm from '../../../../Dashboard/Chat/ChatBox/Form';

const ROOT_URL = process.env.REACT_APP_API;
class UserListItem extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };

  state = {
    showMessageForm: false,
    room: null,
  };

  _setError = message => this.setState(() => ({ error: message }));

  _handleShowMessageForm = () => {
    this.setState(() => ({
      showMessageForm: true,
    }));
  };

  handleSendMessageClick = async receiver => {
    const { loggedUser, socket } = this.props;
    const data = await this._fetchRoomAction(
      receiver,
      loggedUser,
      this.setError,
    );
    await this._handleJoinRequest(data, socket, this._setError);
    this._addNewRoom(data);
    this._handleShowMessageForm();
  };

  _handleJoinRequest = async (data, socket, error) => {
    try {
      if (!data) throw Error('No Room found');
      socket.emit('JOIN_REQUEST', socket.id, data);
    } catch (err) {
      error({
        error: {
          message: err.message,
          title: 'Join',
        },
      });
    }
  };

  _fetchRoomAction = async (receiver, user, error) => {
    try {
      const {
        data: { room },
      } = await axios({
        method: 'get',
        url: `${ROOT_URL}/api/rooms/room?receiver=${receiver._id}&sender=${
          user._id
        }`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      return {
        room: room._id,
        receiver: {
          _id: receiver._id,
          fullName: receiver.fullName,
        },
      };
    } catch (err) {
      error(error.message);
    }
  };

  _addNewRoom = ({ room }) => {
    this.setState(() => ({ room }));
  };

  render() {
    const { user, socket, loggedUser } = this.props;
    const { error, room, showMessageForm } = this.state;
    return (
      <li className="user-item">
        <div>
          {error && error}
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
          <FriendRequestButtonsContainer user={user} />
          <Button
            category="primary"
            onClick={() => this.handleSendMessageClick(user)}
            data-type="draft"
            label="Send Message"
            loading={false}
            style={{
              margin: 0,
            }}
          />
          {showMessageForm && (
            <ChatBoxForm
              socket={socket}
              loggedUser={loggedUser}
              receiver={user}
              room={room}
            />
          )}
        </div>
      </li>
    );
  }
}

export default UserListItem;
