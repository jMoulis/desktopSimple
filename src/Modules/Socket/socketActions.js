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

    this.socket.on(NEW_NOTIFICATION_SUCCESS, notifications => {
      if (fetchNotification) {
        fetchNotification(notifications);
      }
    });
  };

  onNewMessageSuccess = newMessageSuccessAction =>
    this.socket.on(NEW_MESSAGE_SUCCESS, ({ message }) => {
      newMessageSuccessAction(message);
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

  onTypingAction = typingAction =>
    this.socket.on(
      IS_TYPING_MESSAGE_SUCCESS,
      ({ sender, typingUsers, room }) => {
        typingAction(sender, typingUsers, room);
      },
    );

  onStopTyping = typingAction =>
    this.socket.on(STOP_TYPING_MESSAGE_SUCCESS, ({ typingUsers }) => {
      typingAction(null, typingUsers);
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
}

export default SocketActions;
