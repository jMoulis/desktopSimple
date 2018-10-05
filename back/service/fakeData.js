const path = require('path');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fullNames = require('./fakeName');
const images = require('./fakeImageB64');

const User = mongoose.model('user');

const numberUser = 5;

let index = 1;

const prepareImage = (userId, imageBuffer) => {
  const ROOT_FOLDER = path.join(__dirname, '/../uploads/');
  const root = `${ROOT_FOLDER}/users/fake`;
  const destination = `${root}/${userId}`;
  const fileName = `avatar-${uuidv4()}.jpeg`;
  if (fs.existsSync(root)) {
    if (fs.existsSync(destination)) {
      fs.writeFileSync(`${destination}/${fileName}`, imageBuffer, {
        encoding: 'base64',
      });
    } else {
      fs.mkdirSync(destination);
      fs.writeFileSync(`${destination}/${fileName}`, imageBuffer, {
        encoding: 'base64',
      });
    }
  } else {
    fs.mkdirSync(root);
    fs.mkdirSync(destination);
    fs.writeFileSync(`${destination}/${fileName}`, imageBuffer, {
      encoding: 'base64',
    });
  }
  return `/users/fake/${userId}/${fileName}`;
};

const randomData = values => {
  const randomIndex = Math.floor(Math.random() * Math.floor(values.length));
  return values.find((type, idx) => idx === randomIndex);
};

const randomTags = () => {
  const tagsRandom = [];
  const tags = ['php', 'react', 'javascript', 'angular', 'marketing'];
  const randomIndex = Math.floor(Math.random() * Math.floor(5));
  const randomIndex2 = Math.floor(Math.random() * Math.floor(5));
  // How many tag I want to push?
  tagsRandom.push(tags.find((tag, idx) => idx === randomIndex));
  tagsRandom.push(tags.find((tag, idx) => idx === randomIndex2));
  return tagsRandom;
};

const loadFakeUser = () => {
  while (index < numberUser) {
    try {
      const newUser = new User({
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
        logo: '',
        companyName:
          randomData(['company', 'student']) === 'company' &&
          `company-${index}`,
        street: 'ezrzer zerz r ',
        postalCode: '45678',
        town: `town-${index}`,
        industry:
          randomData(['company', 'student']) === 'company' &&
          `industry-${index}`,
        tags: randomTags(),
        teams: [],
        projects: [],
        linkedIn: `linkedIn.com/user${index}`,
        website: `website.com/user${index}`,
        gitHub: `github.com/user${index}`,
        location: '',
        available: randomData([true, false]),
        fake: true,
      });

      Promise.all([newUser.save()]).then(user => {
        const userId = user[0]._id;
        Promise.all([
          User.findOneAndUpdate(
            { _id: userId },
            { $set: { picture: prepareImage(userId, randomData(images)) } },
          ),
        ]);
      });
    } catch (error) {
      console.log(error.message);
    }

    index += 1;
  }
};

module.exports = loadFakeUser;
