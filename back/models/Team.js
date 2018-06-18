const mongoose = require('mongoose');

const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please Provide a name'],
  },
  users: [
    {
      spec: String,
      user: Schema.Types.ObjectId,
    },
  ],
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project',
  },
  mentor: {},
  createdAt: Date,
  updatedAt: Date,
  documents: [],
  isDone: Boolean,
  score: Number,
});

const Team = mongoose.model('team', TeamSchema);

module.exports = Team;
