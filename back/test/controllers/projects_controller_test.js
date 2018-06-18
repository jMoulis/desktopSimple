const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');
const Project = mongoose.model('project');
const Team = mongoose.model('team');

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

const newUser = {
  email: 'julien.moulis@moulis.me',
  fullName: 'Julien Moulis',
  password: 'test',
  typeUser: 'student',
  available: true,
};

let JWT;
let userId;
describe('Projects controller', () => {
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
              assert(res.body.user);
              JWT = res.body.token;
              userId = res.body.user.id;
              done();
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('Create Projects', (done) => {
    const team1 = new Team(newTeam);
    team1.name = 'Team 1';
    const team2 = new Team(newTeam);
    team2.name = 'Team 2';
    const project = new Project(newProject);
    project.teams.push(team1);
    project.teams.push(team2);
    project.save()
      .then(() => {
        request(app)
          .post('/api/projects')
          .set('Authorization', `${JWT}`)
          .send(newProject)
          .end((err, res) => {
            assert(res.body.success.message === 'New Project Created');
            done();
          });
      });
  });

  it('Put to /api/projects/id can update a record', (done) => {
    const project = new Project(newProject);
    project.company = userId;
    project.save()
      .then(() => {
        request(app)
          .put(`/api/projects/${project._id}`)
          .set('Authorization', `${JWT}`)
          .send({ title: 'Project 45' })
          .end((err, res) => {
            Project.findOne({ title: 'Project 45' })
              .then((proj) => {
                assert(res.statusCode === 200);
                assert(proj.title === 'Project 45');
                done();
              });
          });
      });
  });

  it('Delete to /api/projects/:id can delete a record', (done) => {
    const user1 = new User(newUser);
    user1.fullName = 'Rachel'; // Is in both teams

    const user2 = new User(newUser);
    user2.fullName = 'Yael';

    const user3 = new User(newUser);
    const project = new Project(newProject);

    Promise.all([user1.save(), user2.save(), user3.save()])
      .then((users) => {

        const team1 = new Team(newTeam);
        team1.name = 'team1';
        team1.users = users;

        const team2 = new Team(newTeam);
        team2.name = 'team2';
        team2.users = [users[0]];

        Promise.all([team1.save(), team2.save()])
          .then((teams) => {
            Promise.all([
              users[0].update({ $push: { teams: [teams[0]._id, teams[1]._id] } }),
              users[1].update({ $push: { teams: teams[0]._id } }),
              users[2].update({ $push: { teams: teams[0]._id } }),
            ]).then(() => {
              project.teams.push(teams[0]); // Team1
              Team.update({ name: 'team1' }, { project })
                .then(() => {
                  project.save()
                    .then(() => {
                      request(app)
                        .delete(`/api/projects/${project._id}`)
                        .set('Authorization', `${JWT}`)
                        .end(() => {
                          Project.count().then((count) => {
                            assert(count === 0);
                          });
                          User.findOne({ fullName: 'Rachel' })
                            .then((user) => {
                              assert(user.teams.length === 2);
                            });
                          User.findOne({ fullName: 'Yael' })
                            .then((user) => {
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
