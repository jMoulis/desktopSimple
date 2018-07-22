const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost/student_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

beforeEach((done) => {
  const { users, projects, teams } = mongoose.connection.collections;
  users.deleteMany({ email: { $ne: 'admin@admin.com' } });
  projects.deleteMany();
  teams.deleteMany();
  done();
});
