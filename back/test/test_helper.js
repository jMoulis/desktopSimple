const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const assert = require('assert');
const del = require('del');
const path = require('path');

const User = mongoose.model('user');
const Project = mongoose.model('project');
const Team = mongoose.model('team');
const Task = mongoose.model('task');

before(done => {
  mongoose.connect('mongodb://localhost/student_test');
  mongoose.connection.once('open', () => done()).on('error', error => {
    console.warn('Warning', error);
  });
  const tempFilesDir = path.join(__dirname, '/../uploads/test');
  del.sync([`${tempFilesDir}/**`, `!${tempFilesDir}`]);
});

beforeEach(done => {
  const { users, projects, teams, tasks } = mongoose.connection.collections;
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
  tasks.deleteMany();
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

module.exports.newTeam = (name, users = [], projects = []) => {
  const team = new Team({
    name,
    users,
    projects,
  });
  return team;
};

module.exports.newProject = (title, teams = [], maxTeam = 1) => {
  const project = new Project({
    title,
    description: 'lorem  spdfjps sdflkjsdf lkjsdf sdf',
    createdAt: new Date(),
    teams,
    maxTeam,
  });
  return project;
};

module.exports.newTask = (
  title,
  project,
  assign,
  team,
  status = 'todo',
  priority = 'normal',
) => {
  const task = new Task({
    title,
    description: 'String',
    status,
    priority,
    labels: [],
    documents: [],
    comments: [],
    team,
    project,
    type: 'String',
    activities: [],
    createdAt: new Date(),
    editedAt: new Date(),
    assign,
  });
  return task;
};
