const multer = require('multer');
const mime = require('mime');
const fs = require('fs');

const UsersController = require('../controllers/users_controller');
const ProjectsController = require('../controllers/projects_controller');
const AuthController = require('../controllers/auth_controller');
const TeamsController = require('../controllers/teams_controller');
const MessageController = require('../controllers/message_controller');
const TasksController = require('../controllers/tasks_controller');
const FilesController = require('../controllers/files_controller');
const VerifyToken = require('../auth/VerifyToken');
const multerUtil = require('../service/multerStorage');
const CompanyIsAllowedToPost = require('../service/companyIsAllowedToPost');

const { storage } = multerUtil;

const upload = multer({ storage: multer.memoryStorage() });

module.exports = app => {
  app.post('/api/login', AuthController.login);
  app.post('/api/register', upload.single('picture'), AuthController.register);
  app.post('/api/security', VerifyToken, AuthController.changePassword);

  app.get('/api/users', VerifyToken, UsersController.index);
  app.get('/api/users/:id', VerifyToken, UsersController.show);
  app.put(
    '/api/users/:id',
    upload.single('picture'),
    VerifyToken,
    UsersController.edit,
  );
  app.delete('/api/users/:id', VerifyToken, UsersController.delete);

  app.put('/api/friendrequest', VerifyToken, UsersController.friendsRequest);

  app.get('/api/projects', VerifyToken, ProjectsController.index);
  app.post(
    '/api/projects',
    VerifyToken,
    CompanyIsAllowedToPost,
    ProjectsController.create,
  );
  app.get('/api/projects/:id', VerifyToken, ProjectsController.show);
  app.put('/api/projects/:id', VerifyToken, ProjectsController.edit);
  app.delete('/api/projects/:id', VerifyToken, ProjectsController.delete);

  app.get('/api/teams', VerifyToken, TeamsController.index);
  app.post('/api/teams', VerifyToken, TeamsController.create);
  app.get('/api/teams/:id', VerifyToken, TeamsController.show);
  app.put('/api/teams/:id', VerifyToken, TeamsController.edit);
  app.delete('/api/teams/:id', VerifyToken, TeamsController.delete);

  app.get('/api/messages', VerifyToken, MessageController.index);
  app.post('/api/messages', VerifyToken, MessageController.create);
  app.put('/api/messages/:id', VerifyToken, MessageController.edit);
  app.delete('/api/messages/:id', VerifyToken, MessageController.delete);

  app.get('/api/tasks/team/:id', VerifyToken, TasksController.index);
  app.post(
    '/api/tasks',
    upload.array('documents'),
    VerifyToken,
    TasksController.create,
  );
  app.get('/api/tasks/:id', VerifyToken, TasksController.read);
  app.put(
    '/api/tasks/:id',
    VerifyToken,
    upload.array('documents'),
    TasksController.update,
  );
  app.delete('/api/tasks/:id', TasksController.delete);

  app.get('/api/files', VerifyToken, FilesController.index);
  app.delete('/api/files', VerifyToken, FilesController.delete);
};
