const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConversationSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  messages: [{ type: Schema.Types.ObjectId, ref: 'message' }],
});

const Conversation = mongoose.model('conversation', ConversationSchema);

module.exports = Conversation;
