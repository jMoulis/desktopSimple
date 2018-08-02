const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const utils = require('../test_helper');

const User = mongoose.model('user');
const { users } = mongoose.connection.collections;

const newStudent = {
  email: 'julien.moulis@moulis.me',
  fullName: 'Julien Moulis',
  password: 'test',
  typeUser: 'student',
  available: true,
};

let userId;
let JWT = '';

describe('Users controller', () => {
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

  // FETCH USERS
  it('Get to /api/users finds students available', done => {
    const student1 = utils.newUser('student', 14, ['php', 'angular'], true);
    const student2 = utils.newUser('student', 12, ['php', 'angular'], false);
    const company1 = utils.newUser('company', 3, ['php', 'angular'], true, {
      company: {
        companyName: 'company',
        street: 'company',
        postalCode: 'company',
        town: 'company',
        description: 'company',
        legalDocs: 'company',
      },
    });
    Promise.all([student1.save(), company1.save(), student2.save()]).then(
      () => {
        request(app)
          .get('/api/users')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.status === 200);
            assert(res.body.success === true);
            assert(res.body.users.length === 2);
            done();
          });
      },
    );
  });

  it('Get to /api/users finds students available with filter count', done => {
    const student1 = utils.newUser('student', 14, ['php'], true);
    const student2 = utils.newUser('student', 12, ['react'], false);
    const student3 = utils.newUser('student', 13, ['php'], false);
    const student4 = utils.newUser('student', 134, ['php'], true);
    const company1 = utils.newUser('company', 3, ['php', 'angular'], true, {
      company: {
        companyName: 'company',
        street: 'company',
        postalCode: 'company',
        town: 'company',
        description: 'company',
        legalDocs: 'company',
      },
    });
    Promise.all([
      student1.save(),
      student2.save(),
      student3.save(),
      student4.save(),
      company1.save(),
    ]).then(() => {
      request(app)
        .get('/api/users?count=true&filter=php')
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(res.status === 200);
          assert(res.body.success === true);
          assert(res.body.count.count === 2);
          done();
        });
    });
  });

  it('Get to /api/users finds students available with filter', done => {
    const student1 = utils.newUser('student', 14, ['php'], true);
    const student2 = utils.newUser('student', 12, ['react'], false);
    const student3 = utils.newUser('student', 13, ['php'], false);
    const student4 = utils.newUser('student', 134, ['php'], true);
    const company1 = utils.newUser('company', 3, ['php', 'angular'], true, {
      company: {
        companyName: 'company',
        street: 'company',
        postalCode: 'company',
        town: 'company',
        description: 'company',
        legalDocs: 'company',
      },
    });
    Promise.all([
      student1.save(),
      student2.save(),
      student3.save(),
      student4.save(),
      company1.save(),
    ]).then(() => {
      request(app)
        .get('/api/users?filter=php')
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(res.status === 200);
          assert(res.body.success === true);
          assert(res.body.users.length === 2);
          done();
        });
    });
  });

  it('Get to /api/users/:id show User', done => {
    const student = utils.newUser('student', 14, ['php'], true);
    student.save().then(user => {
      request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert((res.body.email = user.email));
          done();
        });
    });
  });

  it('Get to /api/users finds users Errors without JWT', done => {
    const student2 = new User(newStudent);
    student2.email = 'student2@test.com';

    Promise.all([student2.save()]).then(() => {
      request(app)
        .get('/api/users')
        .end((err, res) => {
          assert(res.body.message === 'No token provided.');
          assert(res.status === 403);
          done();
        });
    });
  });

  it('Get to /api/users error in url', done => {
    request(app)
      .get('/api/user')
      .set('Authorization', `${JWT}`)
      .end((err, res) => {
        assert(res.status === 404);
        done();
      });
  });

  xit('Put to /api/users/id can update a record', done => {
    request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `${JWT}`)
      .send({ fullName: 'admin' })
      .end((err, res) => {
        assert(res.statusCode === 200);
        assert(res.body.user.fullName !== 'Julien Moulis');
        assert(res.body.user.fullName === 'admin');
        done();
      });
  });

  it('Delete to /api/users/:id can delete a record', done => {
    const user = utils.newUser('student', 14, ['php'], true);
    user.save().then(() => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `${JWT}`)
        .end(() => {
          User.count().then(count => {
            assert(count === 1);
            done();
          });
        });
    });
  });
});
