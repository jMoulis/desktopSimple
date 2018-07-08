const UsersController = require('../controllers/users_controller');
const ProjectsController = require('../controllers/projects_controller');
const AuthController = require('../controllers/auth_controller');
const TeamsController = require('../controllers/teams_controller');
const MessageController = require('../controllers/message_controller');
const VerifyToken = require('../auth/VerifyToken');
const upload = require('../service/formData');
const CompanyIsAllowedToPost = require('../service/companyIsAllowedToPost');

module.exports = (app) => {
  app.post('/api/login', AuthController.login);
  app.post('/api/register', upload.single('picture'), AuthController.register);
  app.post('/api/security', VerifyToken, AuthController.changePassword);

  app.put('/api/users/:id', upload.single('picture'), VerifyToken, UsersController.edit);
  app.delete('/api/users/:id', VerifyToken, UsersController.delete);
  app.get('/api/users', VerifyToken, UsersController.index);
  app.get('/api/users/:id', VerifyToken, UsersController.show);

  app.post('/api/projects', VerifyToken, CompanyIsAllowedToPost, ProjectsController.create);
  app.put('/api/projects/:id', VerifyToken, ProjectsController.edit);
  app.delete('/api/projects/:id', VerifyToken, ProjectsController.delete);
  app.get('/api/projects', VerifyToken, ProjectsController.index);
  app.get('/api/projects/:id', VerifyToken, ProjectsController.show);

  app.post('/api/teams', VerifyToken, TeamsController.create);
  app.put('/api/teams/:id', VerifyToken, TeamsController.edit);
  app.delete('/api/teams/:id', VerifyToken, TeamsController.delete);
  app.get('/api/teams', VerifyToken, TeamsController.index);
  app.get('/api/teams/:id', VerifyToken, TeamsController.show);

  app.post('/api/messages', VerifyToken, MessageController.create);
  app.put('/api/messages/:id', VerifyToken, MessageController.edit);
  app.delete('/api/messages/:id', VerifyToken, MessageController.delete);
  app.get('/api/messages', VerifyToken, MessageController.index);
};
