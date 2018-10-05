const RoomsController = require('../controllers/rooms_controller');
const VerifyToken = require('../auth/VerifyToken');

module.exports = app => {
  app.get('/api/rooms', VerifyToken, RoomsController.index);
  app.get('/api/rooms/room', VerifyToken, RoomsController.read);
  app.get(
    '/api/rooms/:id/messages',
    VerifyToken,
    RoomsController.fetchRoomMessages,
  );
  app.get(
    '/api/rooms/room/users',
    VerifyToken,
    RoomsController.searchPrivateRoom,
  );
  app.get('/api/rooms/user/:id/room/:room', VerifyToken, RoomsController.index);
};
