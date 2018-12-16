import {
  ADD_ROOM_REQUEST_TO_USER,
  DELETE_ROOM,
  CONNECT_SUCCESS,
  NEW_NOTIFICATION_SUCCESS,
  NEW_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
  NEW_REPLY_SUCCESS,
  UPDATE_REPLY_SUCCESS,
  REPLY_DELETE_SUCCESS,
  IS_TYPING_MESSAGE_SUCCESS,
  STOP_TYPING_MESSAGE_SUCCESS,
  NEW_ROOM_SUCCESS,
  REQUEST_ROOM_ACCEPT_SUCCESS,
  NOTIFICATION_SUCCESS,
} from './socketActionsConstants';

class SocketActions {
  constructor(socket) {
    this.socket = socket;
  }

  addUserToRoom = (usersToAddRoomRequest, room, sender) => {
    this.socket.emit(ADD_ROOM_REQUEST_TO_USER, {
      usersToAddRoomRequest,
      room,
      sender,
    });
  };

  deleteRoomSocketAction = roomId => {
    this.socket.emit(DELETE_ROOM, { roomId }, aknowledgment => {
      console.log(aknowledgment);
    });
  };

  onConnectSuccess = (setConnectedUser, fetchNotification) => {
    this.socket.on(CONNECT_SUCCESS, ({ connectedUsers }) => {
      if (setConnectedUser) {
        setConnectedUser(connectedUsers);
      }
    });
    this.onNotificationSuccess(fetchNotification);
  };

  createNewMessage = ({ room, sender, message }) =>
    this.socket.emit('NEW_MESSAGE', {
      room,
      sender,
      message,
    });

  onNewMessageSuccess = newMessageSuccessAction =>
    this.socket.on(NEW_MESSAGE_SUCCESS, ({ message, totalMessage }) => {
      newMessageSuccessAction({ message, totalMessage });
    });

  onUpdateMessageSuccess = updateMessageSuccess =>
    this.socket.on(UPDATE_MESSAGE_SUCCESS, ({ message }) => {
      updateMessageSuccess(message);
    });

  onDeleteMessageSuccess = deleteMessageSuccessAction =>
    this.socket.on(DELETE_MESSAGE_SUCCESS, ({ message }) => {
      deleteMessageSuccessAction(message);
    });

  onReplySuccess = newReplySuccess =>
    this.socket.on(NEW_REPLY_SUCCESS, ({ reply }) => {
      newReplySuccess(reply);
    });

  onReplyUpdateSuccess = updateMessageSuccess =>
    this.socket.on(UPDATE_REPLY_SUCCESS, ({ reply }) => {
      updateMessageSuccess(reply);
    });

  onReplyDeleteSuccess = deleteMessageSuccess =>
    this.socket.on(REPLY_DELETE_SUCCESS, ({ reply }) => {
      deleteMessageSuccess(reply);
    });

  onTypingSuccessAction = typingAction =>
    this.socket.on(
      IS_TYPING_MESSAGE_SUCCESS,
      ({ sender, typingUsers, room }) => {
        typingAction(sender, typingUsers, room, true);
      },
    );

  emitTypingAction = ({ room, loggedUser }) => {
    this.socket.emit('IS_TYPING_MESSAGE', {
      room,
      sender: {
        _id: loggedUser._id,
        fullName: loggedUser.fullName,
        picture: loggedUser.picture,
      },
    });
  };

  onStopTypingSuccess = typingAction =>
    this.socket.on(STOP_TYPING_MESSAGE_SUCCESS, ({ typingUsers }) => {
      typingAction(null, typingUsers, null, false);
    });

  emitTypingStop = ({ room }) =>
    this.socket.emit('STOP_TYPING_MESSAGE', {
      room,
    });
  onNewRoomSuccess = fetchRoomsSuccessAction =>
    this.socket.on(NEW_ROOM_SUCCESS, ({ rooms }) => {
      fetchRoomsSuccessAction({ rooms });
    });

  onRequestRoomAcceptSuccess = (
    fetchNotificationsSuccessAction,
    fetchRoomsSuccessAction,
  ) =>
    this.socket.on(REQUEST_ROOM_ACCEPT_SUCCESS, ({ notifications, rooms }) => {
      fetchNotificationsSuccessAction({ notifications });
      fetchRoomsSuccessAction({ rooms });
    });

  sendNewNotification = ({ message, receiver, room, type, sender }) =>
    this.socket.emit('NEW_NOTIFICATION', {
      sender,
      message,
      receiver: receiver && receiver,
      type,
      room,
    });

  onNotificationSuccess = fetchNotification =>
    this.socket.on(NEW_NOTIFICATION_SUCCESS, notifications => {
      if (fetchNotification) {
        fetchNotification(notifications);
      }
    });
}

export default SocketActions;
