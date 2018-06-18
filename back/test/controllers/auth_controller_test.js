const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');
const newUser = {
  email: 'julien.moulis@moulis.me',
  fullName: 'Julien Moulis',
  password: 'test',
  typeUser: 'student',
};
describe('Auth Controller', () => {
  it('Create User', (done) => {
    request(app)
      .post('/api/register')
      .send(newUser)
      .end(() => {
        User.findOne({ email: 'julien.moulis@moulis.me' })
          .then((user) => {
            assert(user.fullName === 'Julien Moulis');
          });
        done();
      });
  });

  it('Post to /api/login requires an email and password', (done) => {
    request(app)
      .post('/api/register')
      .send(newUser)
      .end(() => {
        User.findOne({ email: 'julien.moulis@moulis.me' })
          .then((user) => {
            request(app)
              .post('/api/login')
              .send({ email: 'julien.moulis@moulis.me', password: 'test' })
              .end((err, res) => {
                assert(res.statusCode === 200);
                assert(res.body.hasOwnProperty('token'));
                done();
              });
          });
      });
  });
});
