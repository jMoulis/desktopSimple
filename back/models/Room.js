const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoomSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  name: String,
  isPrivate: {
    type: Boolean,
    default: false,
  },
  messages: [{ type: Schema.Types.ObjectId, ref: 'message' }],
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;
