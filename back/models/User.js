const mongoose = require('mongoose');

const { Schema } = mongoose;

const CompanySchema = new Schema({
  companyName: String,
  picture: String,
  street: String,
  postalCode: String,
  town: String,
  description: String,
  tags: Array,
  projects: Array,
  website: String,
  legalDocs: {
    type: Array,
    default: [],
  },
  industry: String,
  linkedIn: String,
});

const UserSchema = new Schema({
  typeUser: {
    type: String,
    required: [true, 'Type account is required'],
  },
  fullName: {
    type: String,
    required: [true, 'FullName is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: v => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v),
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
  },
  company: CompanySchema,
  school: String,
  diploma: String,
  field: String,
  description: String,
  jobDescription: String,
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  picture: String,
  tags: Array,
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'team',
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'project',
  }],
  linkedIn: String,
  website: String,
  gitHub: String,
  available: Boolean,
  fake: Boolean,
  location: String,
  docs: {
    type: Array,
    default: [],
  },
  subscribes: [{
    type: Schema.Types.ObjectId,
    ref: 'project',
  }],
  helper: Boolean,
  isActive: Boolean,
});

UserSchema.pre('save', function preSave(next) {
  if (!this.available) {
    this.available = true;
  } else {
    next();
  }
  return next();
});

UserSchema.pre('update', function preUpdate(next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  return next();
});
const User = mongoose.model('user', UserSchema);

module.exports = User;
