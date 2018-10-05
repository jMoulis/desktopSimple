const NotificationsController = require('../controllers/notifications_controller');
const VerifyToken = require('../auth/VerifyToken');

module.exports = app => {
  app.get('/api/notifications', VerifyToken, NotificationsController.index);
  app.put('/api/notifications', VerifyToken, NotificationsController.update);
};
