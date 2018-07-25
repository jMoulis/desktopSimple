const mongoose = require('mongoose');

const User = mongoose.model('user');
const Project = mongoose.model('project');
const Team = mongoose.model('team');

before((done) => {
  mongoose.connect('mongodb://localhost/student_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

before((done) => {
  const { users, projects, teams } = mongoose.connection.collections;
  users.deleteMany({ email: { $ne: 'admin@admin.com' } });
  projects.deleteMany();
  teams.deleteMany();
  done();
});

module.exports.newUser = (typeUser, emailId, tags, available, ...rest) => {
  const user = new User({
    email: `user${emailId}@mail.com`,
    fullName: 'Julien Moulis',
    password: 'test',
    typeUser,
    available,
    tags,
    ...rest,
  });
  return user;
};

module.exports.newTeam = (name) => {
  const team = new Team({
    name,
    users: [],
    projects: [],
  });
  return team;
};

module.exports.newProject = (title, teams, maxTeam) => {
  const project = new Project({
    title,
    description: 'lorem  spdfjps sdflkjsdf lkjsdf sdf',
    createdAt: new Date(),
    teams,
    maxTeam,
  });
  return project;
};
