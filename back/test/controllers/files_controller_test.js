const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const utils = require('../test_helper');
const path = require('path');

let JWT;

describe('File controller', () => {
  before(done => {
    request(app)
      .post('/api/login')
      .send({ email: 'admin@admin.com', password: 'test' })
      .end((err, res) => {
        assert(res.statusCode === 200);
        JWT = res.body.token;
        assert(Object.prototype.hasOwnProperty.call(res.body, 'token'));
        done();
      });
  });

  it('Get to /api/files/:id find files', done => {
    // Create a task with a file
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
        request(app)
          .get(`${res.body.task.documents[0].url}`)
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(Object.prototype.hasOwnProperty.call(res.body, 'file'));
            assert(res.body.success);
            done();
          });
      });
  });

  it('Delete to /api/files', done => {
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
      .attach('documents', `${dir}test.pdf`)
      .attach('documents', `${dir}test.pdf`)
      .field('title', 'task1')
      .field('team', teamId.toString())
      .field('assign', assign._id.toString())
      .field('project', project._id.toString())
      .end((err, res) => {
        request(app)
          .delete(`${res.body.task.documents[0].url}`)
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.statusCode === 204);
            done();
          });
      });
  });
});
