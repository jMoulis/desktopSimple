const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const assert = require('assert');

const User = mongoose.model('user');
const Project = mongoose.model('project');
const Team = mongoose.model('team');

before(done => {
  mongoose.connect('mongodb://localhost/student_test');
  mongoose.connection.once('open', () => done()).on('error', error => {
    console.warn('Warning', error);
  });
});

beforeEach(done => {
  const { users, projects, teams } = mongoose.connection.collections;
  request(app)
    .post('/api/register')
    .send({
      email: 'admin@admin.com',
      fullName: 'Admin',
      password: 'test',
      typeUser: 'student',
    })
    .end(() => {
      User.findOne({ email: 'admin@admin.com' }).then(user => {
        assert(user.email === 'admin@admin.com');
      });
    });

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
module.exports.newCompany = (typeUser, emailId, tags, available) => {
  const user = new User({
    email: `user${emailId}@mail.com`,
    fullName: 'Julien Moulis',
    password: 'test',
    typeUser,
    available,
    tags,
    company: {
      companyName: 'String',
      picture: 'String',
      street: 'String',
      postalCode: 'String',
      town: 'String',
      description: 'String',
      tags: [],
      projects: [],
      website: 'String',
      legalDocs: [],
      industry: 'String',
      linkedIn: 'String',
    },
  });
  return user;
};

module.exports.newTeam = name => {
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
