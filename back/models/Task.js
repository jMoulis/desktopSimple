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

const DocumentSchema = new Schema({
  name: String,
  folder: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  mimetype: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  url: String,
  type: String,
  originalName: String,
  extension: String,
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
    required: [true, 'Title required'],
  },
  description: String,
  status: {
    type: String,
    default: 'To Do',
  },
  priority: {
    type: String,
    default: 'Medium',
  },
  labels: Array,
  documents: [DocumentSchema],
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
