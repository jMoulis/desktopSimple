const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReplySchema = new Schema({
  message: {
    type: String,
    required: [true, 'Please Provide a message'],
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: Date,
});

const MessageSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Please Provide a message'],
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: Date,
  documents: [],
  replies: [ReplySchema],
  room: {
    type: Schema.Types.ObjectId,
    ref: 'room',
  },
  subscribed: Boolean,
});

MessageSchema.pre('update', function preUpdate(next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  return next();
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;
