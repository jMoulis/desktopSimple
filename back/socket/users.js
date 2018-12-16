class Users {
  constructor() {
    this.users = [];
    this.typingUsers = [];
  }

  addUser(socketId, user) {
    this.users.push({
      fullName: user.fullName,
      picture: user.picture,
      _id: user._id.toString(),
      socketId,
    });
    return user;
  }

  addTypingUser(socketId, user) {
    if (this.typingUsers.length === 0) {
      this.typingUsers = [
        ...this.typingUsers,
        {
          fullName: user.fullName.split(' ')[0],
          picture: user.picture,
          _id: user._id,
          socketId,
        },
      ];
    } else if (
      !this.typingUsers.find(typingUser => typingUser.socketId === socketId)
    ) {
      this.typingUsers = [
        ...this.typingUsers,
        {
          fullName: user.fullName.split(' ')[0],
          picture: user.picture,
          _id: user._id,
          socketId,
        },
      ];
    }
    return user;
  }
  getUsersList() {
    return this.users;
  }

  getUser(socketId) {
    return this.users.find(user => user.socketId === socketId);
  }

  getUserByUserId(userId) {
    return this.users.find(user => user._id === userId);
  }

  removeUser(socketId) {
    const user = this.getUser(socketId);
    if (user) {
      this.users = this.users.filter(user => user.socketId !== socketId);
    }
    return user;
  }

  getTypingUsers() {
    return this.typingUsers;
  }

  removeTypingUser(socketId) {
    const user = this.getUser(socketId);
    if (user) {
      this.typingUsers = this.typingUsers.filter(
        user => user.socketId !== socketId,
      );
    }
    return this.typingUsers;
  }
}

module.exports = Users;
