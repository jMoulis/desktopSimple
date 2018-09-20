const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  createdAt: Date,
  updatedAt: Date,
  documents: [],
});

MessageSchema.pre('update', function preUpdate(next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  return next();
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;
