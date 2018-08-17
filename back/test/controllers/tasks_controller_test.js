const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const utils = require('../test_helper');
const path = require('path');

const Task = mongoose.model('task');

let JWT;
let userId;

describe('Task controller', () => {
  before(done => {
    request(app)
      .post('/api/login')
      .send({ email: 'admin@admin.com', password: 'test' })
      .end((err, res) => {
        assert(res.statusCode === 200);
        JWT = res.body.token;
        userId = res.body.user._id;
        assert(Object.prototype.hasOwnProperty.call(res.body, 'token'));
        done();
      });
  });

  it('Get to /api/tasks/team/:id finds tasks', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const task1 = utils.newTask('task1', project, assign, team);
    const task2 = utils.newTask('task2', project, assign, team);
    const task3 = utils.newTask('task3', project, assign, team);
    Promise.all([task1.save(), task2.save(), task3.save()]).then(() => {
      request(app)
        .get(`/api/tasks/team/${team._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'tasks'));
          assert(res.body.success);
          assert(res.body.tasks.length === 3);
          done();
        });
    });
  });

  it('Create to /api/tasks', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const dir = path.join(__dirname, '/../files/');
    const teamId = team._id;
    request(app)
      .post('/api/tasks')
      .set('Authorization', `${JWT}`)
      .set('type', `test`)
      .set('folder', team._id)
      .attach('documents', `${dir}test.pdf`)
      .field('title', 'task1')
      .field('team', teamId.toString())
      .field('assign', assign._id.toString())
      .field('project', project._id.toString())
      .end((err, res) => {
        assert(Object.prototype.hasOwnProperty.call(res.body, 'task'));
        assert(res.body.success);
        assert(res.body.task.title === 'task1');
        done();
      });
  });

  it('Read to /api/tasks/:id', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const task1 = utils.newTask('task1', project, assign, team);
    task1.save().then(task => {
      request(app)
        .get(`/api/tasks/${task._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'task'));
          assert(res.body.success);
          assert(res.body.task.title === 'task1');
          done();
        });
    });
  });

  it('Wrong Read to /api/tasks/:id', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const task1 = utils.newTask('task1', project, assign, team);
    task1.save().then(() => {
      request(app)
        .get(`/api/tasks/5b7683406fc78f2a4f1303a2`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'errors'));
          assert(res.body.errors.error.detail === 'Task not found');
          done();
        });
    });
  });

  it('Update to /api/tasks/:id', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const task1 = utils.newTask('task1', project, assign, team);

    task1.save().then(task => {
      request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `${JWT}`)
        .send({ title: 'task1 bis' })
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'task'));
          assert(res.body.success);
          assert(res.body.task.title === 'task1 bis');
          done();
        });
    });
  });

  it('Wrong Update to /api/tasks/:id', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const task1 = utils.newTask('task1', project, assign, team);

    task1.save().then(() => {
      request(app)
        .put(`/api/tasks/5b7683406fc78f2a4f1303a2`)
        .set('Authorization', `${JWT}`)
        .send({ title: 'task1 bis' })
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'errors'));
          assert(res.body.errors.error.detail === 'Task not found');
          done();
        });
    });
  });

  it('Delete to /api/tasks/:id', done => {
    const project = utils.newProject('test');
    const assign = utils.newUser('student', 234);
    const team = utils.newTeam('team 1');
    const task1 = utils.newTask('task1', project, assign, team);
    task1.save().then(task => {
      request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(res.statusCode === 204);
          done();
        });
    });
  });
});
