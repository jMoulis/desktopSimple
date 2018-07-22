const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');
const Team = mongoose.model('team');
const Project = mongoose.model('project');
const newTeam = {
  name: 'Team 1',
  users: [],
};
const newProject = {
  title: 'Project',
  description: 'lorem  spdfjps sdflkjsdf lkjsdf sdf',
  createdAt: new Date(),
};
const newUser = {
  email: 'julien.moulis@moulis.me',
  fullName: 'Julien Moulis',
  password: 'test',
  typeUser: 'student',
  available: true,
};
let JWT;
let adminUser;
describe('Teams controller', () => {
  // before((done) => {
  //   User.findOne({ email: 'admin@admin.com' })
  //     .then((user) => {
  //       if (!user) {
  //         request(app)
  //           .post('/api/register')
  //           .send({
  //             email: 'admin@admin.com',
  //             fullName: 'Admin',
  //             password: 'test',
  //             typeUser: 'company',
  //             company: {
  //               companyName: 'company',
  //               street: 'company',
  //               postalCode: 'company',
  //               town: 'company',
  //               description: 'company',
  //               legalDocs: 'company',
  //             },
  //           })
  //           .end((err, res) => {
  //             assert(res.statusCode === 201);
  //             assert(res.body.token);
  //             JWT = res.body.token;
  //             adminUser = res.body.user;
  //             done();
  //           });
  //       } else {
  //         request(app)
  //           .post('/api/login')
  //           .send({ email: 'admin@admin.com', password: 'test' })
  //           .end((err, res) => {
  //             assert(res.statusCode === 200);
  //             JWT = res.body.token;
  //             adminUser = user;
  //             done();
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  xit('Get to /api/teams finds teams', (done) => {
    const team1 = new Team(newTeam);
    team1.users = [
      {
        speciality: 'php',
        user: adminUser,
      },
    ];
    const team2 = new Team({ name: 'Team 2' });

    Promise.all([team1.save(), team2.save()])
      .then((data) => {
        request(app)
          .get('/api/teams')
          .set('Authorization', `${JWT}`)
          .end((err, res) => {
            assert(res.body.hasOwnProperty('teams'));
            done();
          });
      });
  });

  xit('Create Team', (done) => {
    const project1 = new Project(newProject);
    const user1 = new User(newUser);
    const manager = new User(newUser);
    project1.company = adminUser._id;
    newTeam.manager = manager;
    Promise.all([user1.save(), manager.save()])
      .then((users) => {
        newTeam.users.push({
          spec: 'php',
          user: users[0],
        });
        newTeam.users.push({
          spec: 'manager',
          user: users[1],
        });
        project1.save()
          .then((project) => {
            newTeam.project = project;
            request(app)
              .post('/api/teams')
              .set('Authorization', `${JWT}`)
              .send(newTeam)
              .end((err, res) => {
                Project.findOne({ _id: project._id })
                  .then((proj) => {
                    assert(proj.teams.length === 1);
                  });
                assert(res.body.success.status);
                assert(res.body.success.message === 'New Team Created');
                done();
              });
          });
      });
  });
  xit('Put to /api/teams/id can update a record', (done) => {
    const team1 = new Team(newTeam);
    team1.save()
      .then(() => {
        request(app)
          .put(`/api/teams/${team1._id}`)
          .set('Authorization', `${JWT}`)
          .send({ name: 'Team 45' })
          .end((err, res) => {
            Team.findOne({ name: 'Team 45' })
              .then((team) => {
                assert(res.statusCode === 200);
                assert(team.name === 'Team 45');
                done();
              });
          });
      });
  });

  xit('Delete to /api/teams/:id can delete a record', (done) => {
    const team = new Team(newTeam);
    team.save().then(() => {
      request(app)
        .delete(`/api/teams/${team._id}`)
        .set('Authorization', `${JWT}`)
        .end((err, res) => {
          User.updateMany();
          Team.count().then((count) => {
            assert(count === 0);
            done();
          });
        });
    });
  });
});
