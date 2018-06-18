const mongoose = require('mongoose');
const User = mongoose.model('user');
const request = require('supertest');
const app = require('../app');
const assert = require('assert');

const authUser = request.agent(app);

const newUser = {
  email: 'admin@admin.com',
  fullName: 'Admin',
  password: 'test',
  typeUser: 'stduent',
};

const admin = new User(newUser);

before(done => {
  mongoose.connect('mongodb://localhost/student_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', error => {
      console.warn('Warning', error);
    });
});

beforeEach(done => {
  const { users, projects, teams } = mongoose.connection.collections;
  users.deleteMany({ email: { $ne: 'admin@admin.com' }});
  projects.deleteMany();
  teams.deleteMany();
  done();
});
