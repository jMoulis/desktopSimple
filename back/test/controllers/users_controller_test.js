const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const utils = require('../test_helper');

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
  available: true,
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
        User.findOne({ email: res.body.user.email })
          .then((user) => {
            request(app)
              .post('/api/login')
              .send({ email: user.email, password: 'test' })
              .end((err, response) => {
                JWT = response.body.token;
                assert(response.statusCode === 200);
                assert(Object.prototype.hasOwnProperty.call(response.body, 'token'));
                done();
              });
          });
      });
  });

  // FETCH USERS
  it('Get to /api/users finds students available', (done) => {
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
    Promise.all([student1.save(), company1.save(), student2.save()])
      .then(() => {
        request(app)
          .get('/api/users')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.status === 200);
            assert(res.body.success === 'Fetch Users');
            assert(res.body.users.length === 1);
            done();
          });
      });
  });

  it('Get to /api/users finds students available with filter count', (done) => {
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
    Promise.all([student1.save(), student2.save(), student3.save(), student4.save(), company1.save()])
      .then(() => {
        request(app)
          .get('/api/users?count=true&filter=php')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.status === 200);
            assert(res.body.success === 'Count');
            assert(res.body.count.count === 2);
            done();
          });
      });
  });

  it('Get to /api/users finds available with filter count', (done) => {
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
    Promise.all([student1.save(), student2.save(), student3.save(), student4.save(), company1.save()])
      .then(() => {
        request(app)
          .get('/api/users?count=true&filter=php')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.status === 200);
            assert(res.body.success === 'Count');
            assert(res.body.count.count === 2);
            done();
          });
      });
  });

  it('Get to /api/users finds students available with filter', (done) => {
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
    Promise.all([student1.save(), student2.save(), student3.save(), student4.save(), company1.save()])
      .then(() => {
        request(app)
          .get('/api/users?filter=php')
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

  it('Put to /api/users/id can update a record', (done) => {
    const user = utils.newUser('student', 14, ['php'], true);
    user.save()
      .then(() => {
        request(app)
          .put(`/api/users/${user._id}`)
          .set('Authorization', `${JWT}`)
          .send({ fullName: 'julien' })
          .end((err, res) => {
            assert(res.statusCode === 200);
            assert(res.body.user.fullName !== 'Julien Moulis');
            assert(res.body.user.fullName === 'julien');
            done();
          });
      });
  });

  it('Delete to /api/users/:id can delete a record', (done) => {
    const user = utils.newUser('student', 14, ['php'], true);
    user.save().then(() => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `${JWT}`)
        .end(() => {
          User.count().then((count) => {
            assert(count === 0);
            done();
          });
        });
    });
  });
});
