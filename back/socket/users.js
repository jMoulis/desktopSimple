class Users {
  constructor() {
    this.users = [];
  }

  addUser(socketId, user) {
    this.users.push({
      fullName: user.fullName,
      picture: user.picture,
      _id: user._id,
      socketId,
    });
    return user;
  }

  getUsersList() {
    return this.users;
  }

  getUser(socketId) {
    return this.users.find(user => user.socketId === socketId);
  }

  removeUser(socketId) {
    const user = this.getUser(socketId);
    if (user) {
      this.users = this.users.filter(user => user.socketId !== socketId);
    }
    return user;
  }
}

module.exports = Users;
