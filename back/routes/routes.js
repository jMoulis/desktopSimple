const multer = require('multer');

const UsersController = require('../controllers/users_controller');
const ProjectsController = require('../controllers/projects_controller');
const AuthController = require('../controllers/auth_controller');
const TeamsController = require('../controllers/teams_controller');
const MessageController = require('../controllers/messages_controller');
const TasksController = require('../controllers/tasks_controller');
const CommentsController = require('../controllers/comments_controller');
const FilesController = require('../controllers/files_controller');
const ErrorsFrontController = require('../controllers/errors_front_controller');
const VerifyToken = require('../auth/VerifyToken');
const multerUtil = require('../service/multerStorage');
const CompanyIsAllowedToPost = require('../service/companyIsAllowedToPost');
const ApiResponse = require('../service/api/apiResponse_v2');
const roomsRoutes = require('./rooms_routes');
const notificationsRoutes = require('./notifications_routes');

const { storage } = multerUtil;

const upload = multer({ storage: multer.memoryStorage() });

module.exports = app => {
  roomsRoutes(app);
  notificationsRoutes(app);
  app.post('/api/login', AuthController.login);
  app.post('/api/register', upload.single('picture'), AuthController.register);
  app.post('/api/security', VerifyToken, AuthController.changePassword);

  app.get('/api/users', VerifyToken, UsersController.index);
  app.get('/api/users/friends', VerifyToken, UsersController.findFriends);
  app.get('/api/users/:id', VerifyToken, UsersController.show);
  app.put(
    '/api/users/:id',
    VerifyToken,
    upload.fields([{ name: 'company.files' }, { name: 'files' }]),
    UsersController.edit,
  );
  app.put(
    '/api/users/:id/room/:room',
    VerifyToken,
    UsersController.editRoomStatus,
  );
  app.delete('/api/users/:id', VerifyToken, UsersController.delete);

  app.put('/api/friendrequest', VerifyToken, UsersController.friendsRequest);

  app.get('/api/projects', VerifyToken, ProjectsController.index);
  app.post(
    '/api/projects',
    VerifyToken,
    CompanyIsAllowedToPost,
    upload.array('files'),
    ProjectsController.create,
  );
  app.get('/api/projects/:id', VerifyToken, ProjectsController.show);
  app.put(
    '/api/projects/:id',
    VerifyToken,
    upload.array('files'),
    ProjectsController.edit,
  );
  app.delete('/api/projects/:id', VerifyToken, ProjectsController.delete);

  app.get('/api/teams', VerifyToken, TeamsController.index);
  app.post('/api/teams', VerifyToken, TeamsController.create);
  app.get('/api/teams/:id', VerifyToken, TeamsController.show);
  app.put('/api/teams/:id', VerifyToken, TeamsController.edit);
  app.delete('/api/teams/:id', VerifyToken, TeamsController.delete);

  app.post('/api/messages', VerifyToken, MessageController.create);
  app.get(
    '/api/messages/room/:roomId',
    VerifyToken,
    MessageController.fetchRoomMessages,
  );
  app.put('/api/messages/:id', VerifyToken, MessageController.update);
  app.delete('/api/messages/:id', VerifyToken, MessageController.delete);

  // Tasks
  app.get('/api/tasks', VerifyToken, TasksController.index);
  app.post(
    '/api/tasks',
    upload.array('files'),
    VerifyToken,
    TasksController.create,
  );
  app.get('/api/tasks/:id', VerifyToken, TasksController.read);
  app.put(
    '/api/tasks/:id',
    VerifyToken,
    upload.array('files'),
    TasksController.update,
  );
  app.delete('/api/tasks/:id', VerifyToken, TasksController.delete);
  app.get('/api/tasks/users/:id', VerifyToken, TasksController.getUserTask);
  // Comments
  app.put('/api/tasks/comments/:id', VerifyToken, CommentsController.update);
  app.delete('/api/tasks/comments/:id', VerifyToken, CommentsController.delete);

  app.post('/api/files', VerifyToken, FilesController.index);
  app.delete('/api/files', VerifyToken, FilesController.delete);

  app.post('/api/errors', VerifyToken, ErrorsFrontController.create);
  app.get('*', (req, res) => {
    const apiResponse = new ApiResponse(res);
    return apiResponse.failure(404, null, 'Route not found');
  });
};
