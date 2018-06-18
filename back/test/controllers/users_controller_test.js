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
  available: true,
};
let JWT = '';

describe('Users controller', () => {
  before((done) => {
    User.findOne({ email: 'admin@admin.com'})
      .then((user) => {
        if (!user) {
          request(app)
            .post('/api/register')
            .send({
              email: 'admin@admin.com',
              fullName: 'Admin',
              password: 'test',
              typeUser: 'company',
            })
            .end((err, res) => {
              assert(res.statusCode === 201);
              assert(res.body.token);
              JWT = res.body.token;
              done();
            });
        } else {
          request(app)
            .post('/api/login')
            .send({ email: 'admin@admin.com', password: 'test'})
            .end((err, res) => {
              assert(res.statusCode === 200);
              JWT = res.body.token;
              done();
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('Get to /api/users finds users', (done) => {
    const julien = new User(newUser);
    const rachel = new User(newUser);
    rachel.email = 'rachel@moulis.me';
    rachel.fullName = 'Rachel Moulis';

    Promise.all([julien.save(), rachel.save()])
      .then(() => {
        request(app)
          .get('/api/users')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            const hasUsersProperty = Object.hasOwnProperty.call(res.body, 'users');
            assert(hasUsersProperty);
            assert(res.body.users.length === 2);
            done();
          });
      });
  });

  it('Put to /api/users/id can update a record', (done) => {
    const user = new User(newUser);
    user.save()
      .then(() => {
        request(app)
          .put(`/api/users/${user._id}`)
          .set('Authorization', `${JWT}`)
          .send({ email: 'julien.moulis@mac.me' })
          .end((err, res) => {
            User.findOne({ email: 'julien.moulis@mac.me' })
              .then(() => {
                assert(res.statusCode === 200);
                assert(user.fullName === 'Julien Moulis');
                done();
              });
          });
      });
  });

  it('Delete to /api/users/:id can delete a record', (done) => {
    const user = new User(newUser);
    user.save().then(() => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `${JWT}`)
        .end(() => {
          User.count().then((count) => {
            assert(count === 1);
            done();
          });
        });
    });
  });
});
