const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Message required'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  editedAt: {
    type: Date,
    default: new Date(),
  },
});

const ActivitySchema = new Schema({
  type: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Message required'],
  },
  description: String,
  status: {
    type: String,
  },
  priority: String,
  labels: Array,
  documents: {
    type: Array,
    default: [],
  },
  comments: [CommentSchema],
  team: {
    type: Schema.Types.ObjectId,
    ref: 'team',
    required: [true, 'Team required'],
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project',
  },
  type: String,
  activities: [ActivitySchema],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  editedAt: {
    type: Date,
    default: new Date(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  assign: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Task = mongoose.model('task', TaskSchema);

module.exports = Task;
