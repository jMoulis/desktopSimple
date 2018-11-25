import { ADD_ROOM_REQUEST_TO_USER } from './socketActionsConstants';

export default class SocketActions {
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
}
