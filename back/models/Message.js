const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Please Provide a message'],
  },
  author: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  team: {
    type: Schema.Types.ObjectId,
    ref: 'team',
  },
  createdAt: Date,
  updatedAt: Date,
  documents: [],
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;
