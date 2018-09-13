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
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const FileSchema = new Schema({
  name: String,
  path: String,
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
  folder: String,
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
  taskIdFolder: String,
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
  tags: Array,
  files: [FileSchema],
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
  activities: [ActivitySchema],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  dueDate: {
    type: Date,
  },
  updatedAt: {
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

TaskSchema.pre('update', function preUpdate(next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  return next();
});

const Task = mongoose.model('task', TaskSchema);

module.exports = Task;
