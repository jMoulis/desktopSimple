const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');

const newStudent = {
  email: 'julien.moulis@moulis.me',
  fullName: 'Julien Moulis',
  password: 'test',
  typeUser: 'student',
  available: true,
};

const newCompany = {
  email: 'rachel.moulis@moulis.me',
  fullName: 'Rachel Moulis',
  password: 'test',
  typeUser: 'company',
  company: {
    companyName: 'company',
    street: 'company',
    postalCode: 'company',
    town: 'company',
    description: 'company',
    legalDocs: 'company',
  },
};
let JWT = '';
const student = new User(newStudent);
const company = new User(newCompany);

describe('Users controller', () => {
  before((done) => {
    request(app)
      .post('/api/register')
      .send(company)
      .end((err, res) => {
        User.findOne({ email: 'rachel.moulis@moulis.me' })
          .then(() => {
            JWT = res.body.token;
          });
        done();
      });
  });

  // FETCH USERS
  it('Get to /api/users finds users', (done) => {
    const student2 = new User(newStudent);
    student2.email = 'student2@test.com';

    Promise.all([student.save(), company.save(), student2.save()])
      .then(() => {
        request(app)
          .get('/api/users')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.status === 200);
            assert(res.body.success === 'Fetch Users');
            assert(res.body.users.length === 2);
            done();
          });
      });
  });

  it('Get to /api/users finds users Errors without JWT', (done) => {
    const student2 = new User(newStudent);
    student2.email = 'student2@test.com';

    Promise.all([student.save(), company.save(), student2.save()])
      .then(() => {
        request(app)
          .get('/api/users')
          .end((err, res) => {
            assert(res.body.message === 'No token provided.');
            assert(res.status === 403);
            done();
          });
      });
  });

  it('Get to /api/users finds users no users', (done) => {
    request(app)
      .get('/api/users')
      .set('Authorization', `${JWT}`)
      .end((err, res) => {
        assert(res.body.errors.error === 'No users found')
        assert(res.status === 404);
        done();
      });
  });

  it('Get to /api/users error in url', (done) => {
    request(app)
      .get('/api/user')
      .set('Authorization', `${JWT}`)
      .end((err, res) => {
        assert(res.status === 422);
        done();
      });
  });

  xit('Put to /api/users/id can update a record', (done) => {
    const user = new User(newStudent);
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

  xit('Delete to /api/users/:id can delete a record', (done) => {
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
