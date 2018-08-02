const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const { users } = mongoose.connection.collections;

const User = mongoose.model('user');
const Project = mongoose.model('project');
const Team = mongoose.model('team');
const utils = require('../test_helper');

const newProject = {
  title: 'Project',
  description: 'lorem  spdfjps sdflkjsdf lkjsdf sdf',
  createdAt: new Date(),
  teams: [],
  maxTeam: 1,
};

const newTeam = {
  name: 'test',
  users: [],
  projects: [],
};

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
      .end((err, res) => {
        Promise.all([team1.save(), team2.save()])
          .then(teams => {
            const project = utils.newProject(2, teams);
            request(app)
              .post('/api/projects')
              .set('Authorization', `${JWT}`)
              .send(project)
              .end((err, res) => {
                assert(res.body.success === true);
                done();
              });
          })
          .catch(error => console.log(error));
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
            assert(res.body.success);
            assert(proj.title === 'Project 45');
            done();
          });
        });
    });
  });

  xit('Delete to /api/projects/:id can delete a record', done => {
    const user1 = new User(newUser);
    user1.fullName = 'Rachel'; // Is in both teams

    const user2 = new User(newUser);
    user2.fullName = 'Yael';

    const user3 = new User(newUser);
    const project = new Project(newProject);

    Promise.all([user1.save(), user2.save(), user3.save()]).then(users => {
      const team1 = new Team(newTeam);
      team1.name = 'team1';
      team1.users = users;

      const team2 = new Team(newTeam);
      team2.name = 'team2';
      team2.users = [users[0]];

      Promise.all([team1.save(), team2.save()]).then(teams => {
        Promise.all([
          users[0].update({ $push: { teams: [teams[0]._id, teams[1]._id] } }),
          users[1].update({ $push: { teams: teams[0]._id } }),
          users[2].update({ $push: { teams: teams[0]._id } }),
        ]).then(() => {
          project.teams.push(teams[0]); // Team1
          Team.update({ name: 'team1' }, { project }).then(() => {
            project.save().then(() => {
              request(app)
                .delete(`/api/projects/${project._id}`)
                .set('Authorization', `${JWT}`)
                .end(() => {
                  Project.count().then(count => {
                    assert(count === 0);
                  });
                  User.findOne({ fullName: 'Rachel' }).then(user => {
                    assert(user.teams.length === 2);
                  });
                  User.findOne({ fullName: 'Yael' }).then(user => {
                    assert(user.teams.length === 1);
                  });
                  Team.count().then(count => assert(count === 2));
                });
            });
          });
        });
        done();
      });
    });
  });
});
