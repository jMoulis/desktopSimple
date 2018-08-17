const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Project = mongoose.model('project');
const utils = require('../test_helper');

let JWT;
let userId;

describe('Projects controller', () => {
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

  it('Create Projects', done => {
    const team1 = utils.newTeam('team1');
    const team2 = utils.newTeam('team2');

    request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `${JWT}`)
      .send({
        company: {
          'company.companyName': 'String',
          'company.picture': 'String',
          'company.street': 'String',
          'company.postalCode': 'String',
          'company.town': 'String',
          'company.description': 'String',
          'company.tags': [],
          'company.projects': [],
          'company.website': 'String',
          'company.legalDocs': [],
          'company.industry': 'String',
          'company.linkedIn': 'String',
        },
      })
      .end(() => {
        Promise.all([team1.save(), team2.save()]).then(teams => {
          const project = utils.newProject(2, teams);
          request(app)
            .post('/api/projects')
            .set('Authorization', `${JWT}`)
            .send(project)
            .end((err, res) => {
              assert(Object.prototype.hasOwnProperty.call(res.body, 'project'));
              assert(res.body.success === true);
              done();
            });
        });
      });
  });

  it('Show to /api/projects/id can show a record', done => {
    const project = utils.newProject('title', [], 3);
    project.company = userId;

    project.save().then(() => {
      request(app)
        .get(`/api/projects/${project._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'project'));
          assert(res.body.success);
          assert(res.body.project.title === 'title');
          done();
        });
    });
  });

  it('Wrong Show to /api/projects/id can show a record', done => {
    const project = utils.newProject('title', [], 3);
    project.company = userId;

    project.save().then(() => {
      request(app)
        .get(`/api/projects/5b7683406fc78f2a4f1303a2`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'errors'));
          assert(res.body.errors.error.detail === 'Project not found');
          done();
        });
    });
  });

  it('Put to /api/projects/id can update a record', done => {
    const project = utils.newProject('title', [], 3);
    project.company = userId;

    project.save().then(() => {
      request(app)
        .put(`/api/projects/${project._id}`)
        .set('Authorization', `${JWT}`)
        .send({ title: 'Project 45' })
        .end((err, res) => {
          Project.findOne({ title: 'Project 45' }).then(proj => {
            assert(Object.prototype.hasOwnProperty.call(res.body, 'project'));
            assert(res.body.success);
            assert(proj.title === 'Project 45');
            done();
          });
        });
    });
  });

  it('Wrong Put to /api/projects/id can Put a record', done => {
    const project = utils.newProject('title', [], 3);
    project.company = userId;

    project.save().then(() => {
      request(app)
        .put(`/api/projects/5b7683406fc78f2a4f1303a2`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'errors'));
          assert(res.body.errors.error.detail === 'Cannot update project');
          done();
        });
    });
  });

  it('Delete to /api/projects/:id can delete a record', done => {
    const newProject = utils.newProject('title', [], 3);
    const newProject2 = utils.newProject('title', [], 4);
    Promise.all([newProject.save(), newProject2.save()]).then(projects => {
      const projToDelete = projects[0];
      request(app)
        .delete(`/api/projects/${projToDelete._id}`)
        .set('Authorization', `${JWT}`)
        .end(() => {
          Project.count().then(count => {
            assert(count === 1);
            done();
          });
        });
    });
  });
});
