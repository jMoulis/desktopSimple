const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const utils = require('../test_helper');

const User = mongoose.model('user');
const Team = mongoose.model('team');

const newTeam = {
  name: 'Team 1',
  users: [],
};

let JWT;
let userId;

describe('Teams controller', () => {
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

  it('Get to /api/teams finds teams', done => {
    const team1 = utils.newTeam('team1', [
      {
        speciality: 'php',
        user: userId,
      },
    ]);
    const team2 = new Team({ name: 'Team 2' });

    Promise.all([team1.save(), team2.save()]).then(() => {
      request(app)
        .get('/api/teams')
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'teams'));
          assert(res.body.teams.length === 1);
          assert(res.body.teams[0].name === 'team1');
          done();
        });
    });
  });

  it('Create Team', done => {
    const project1 = utils.newProject('project1');
    const user1 = utils.newUser('student', 456, ['php', 'react'], true);

    project1.company = userId;

    user1.save().then(user => {
      newTeam.users.push({
        spec: 'php',
        user: user._id,
      });
    });

    project1.save().then(project => {
      newTeam.project = project._id;
      request(app)
        .post('/api/teams')
        .set('Authorization', `${JWT}`)
        .send(newTeam)
        .end((err, res) => {
          assert(Object.prototype.hasOwnProperty.call(res.body, 'team'));
          assert(res.body.success === true);
          assert(res.body.team.name === 'Team 1');
          done();
        });
    });
  });

  it('Show to /api/teams/id show a team', done => {
    const team1 = new Team(newTeam);
    team1.save().then(() => {
      request(app)
        .get(`/api/teams/${team1._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          Team.findOne({ name: 'Team 1' }).then(team => {
            assert(Object.prototype.hasOwnProperty.call(res.body, 'team'));
            assert(res.body.success === true);
            assert(team.name === 'Team 1');
            done();
          });
        });
    });
  });

  it('Wrong user id Show to /api/teams/id show a team', done => {
    const team1 = new Team(newTeam);
    team1.save().then(() => {
      request(app)
        .get('/api/teams/5b7683406fc78f2a4f1303a2')
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(res.body.errors.error.detail === 'Team not found');
          done();
        });
    });
  });

  it('Put to /api/teams/id can update a record', done => {
    const team1 = new Team(newTeam);
    team1.save().then(() => {
      request(app)
        .put(`/api/teams/${team1._id}`)
        .set('Authorization', `${JWT}`)
        .send({ name: 'Team 45' })
        .end((err, res) => {
          Team.findOne({ name: 'Team 45' }).then(team => {
            assert(Object.prototype.hasOwnProperty.call(res.body, 'team'));
            assert(res.body.success === true);
            assert(team.name === 'Team 45');
            done();
          });
        });
    });
  });

  it('Wrong user id Put to /api/teams/id put a team', done => {
    const team1 = new Team(newTeam);
    team1.save().then(() => {
      request(app)
        .put('/api/teams/5b7683406fc78f2a4f1303a2')
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          assert(res.body.errors.error.detail === 'Unable to Update team');
          done();
        });
    });
  });

  it('Delete to /api/teams/:id can delete a record', done => {
    const team = new Team(newTeam);
    team.save().then(() => {
      request(app)
        .delete(`/api/teams/${team._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          User.updateMany();
          Team.count().then(count => {
            assert(count === 0);
            done();
          });
        });
    });
  });
});
