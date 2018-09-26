const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReplySchema = new Schema({
  text: {
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
  message: {
    type: Schema.Types.ObjectId,
    ref: 'message',
  },
});

ReplySchema.pre('update', function preUpdate(next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  return next();
});

const Reply = mongoose.model('reply', ReplySchema);

module.exports = Reply;
