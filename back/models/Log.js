const mongoose = require('mongoose');

const { Schema } = mongoose;

const LogSchema = new Schema({
  log: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Message = mongoose.model('log', LogSchema);

module.exports = Message;
