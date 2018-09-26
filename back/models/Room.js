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
    default: true,
  },
  messages: [{ type: Schema.Types.ObjectId, ref: 'message' }],
  isArchived: {
    type: Boolean,
    default: false,
  },
  isPrivateMessage: {
    type: Boolean,
    default: false,
  },
  isTeamRoom: {
    type: Boolean,
    default: false,
  },
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;
