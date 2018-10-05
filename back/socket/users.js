class Users {
  constructor() {
    this.users = [];
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
}

module.exports = Users;
