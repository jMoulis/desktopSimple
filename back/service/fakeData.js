const fullNames = require('./fakeName');
const images = require('./fakeImageB64');
const bcrypt = require('bcryptjs');

const numberUser = 20;

let index = 1;
const Users = [];
function randomData(values) {
  const randomIndex = Math.floor(Math.random() * Math.floor(values.length));
  return values.find((type, idx) => idx === randomIndex);
}
function randomTags() {
  const tagsRandom = [];
  const tags = ['php', 'react', 'javascript', 'angular', 'marketing'];
  const randomIndex = Math.floor(Math.random() * Math.floor(5));
  const randomIndex2 = Math.floor(Math.random() * Math.floor(5));
  // How many tag I want to push?
  tagsRandom.push(tags.find((tag, idx) => idx === randomIndex));
  tagsRandom.push(tags.find((tag, idx) => idx === randomIndex2));
  return tagsRandom;
}
function loadFakeUser() {
  while (index < numberUser) {
    const newUser = {
      typeUser: randomData(['company', 'student']),
      fullName: randomData(fullNames),
      email: `julien.moulis+${index}@moulis.me`,
      password: bcrypt.hashSync('test', 10),
      school:
        randomData(['company', 'student']) === 'student' && `school-${index}`,
      diploma: 'Fake',
      description: 'tslkjsldkfj sdlfksjdflk sldkfjsldkf sldkfjsldkf',
      createdAt: new Date(),
      updatedAt: new Date(),
      picture: `data:image/jpeg;base64,${randomData(images)}`,
      logo: '',
      companyName:
        randomData(['company', 'student']) === 'company' && `company-${index}`,
      street: 'ezrzer zerz r ',
      postalCode: '45678',
      town: `town-${index}`,
      industry:
        randomData(['company', 'student']) === 'company' && `industry-${index}`,
      tags: randomTags(),
      teams: [],
      projects: [],
      linkedIn: `linkedIn.com/user${index}`,
      website: `website.com/user${index}`,
      gitHub: `github.com/user${index}`,
      location: '',
      available: randomData([true, false]),
      fake: true,
    };
    Users.push(newUser);
    index += 1;
  }
  return Users;
}

module.exports = loadFakeUser;
