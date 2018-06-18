const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please give a title to your project'],
  },
  description: String,
  dueDate: {
    type: Date,
  },
  spec: String,
  isContest: Boolean,
  maxTeam: {
    type: Number,
    min: 1,
    max: 4,
    default: 1,
  },
  isPrice: Boolean,
  price: String,
  tags: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'team',
  }],
  docs: Array,
  status: String,
  draft: Boolean,
  subscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
});

ProjectSchema.pre('save', function test(next) {
  if (!this.maxTeam) {
    this.maxTeam = 1;
  } else {
    next();
  }
  return next();
});
const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
