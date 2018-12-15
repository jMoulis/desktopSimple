const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoomSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  name: {
    type: String,
    required: [true, 'The Room name is mandatory'],
  },
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
  createdAt: {
    type: Date,
    default: new Date(),
  },
  pendingRequest: Array,
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;
