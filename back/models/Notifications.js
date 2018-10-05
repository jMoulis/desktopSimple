const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationsSchema = new Schema({
  type: {
    type: String,
  },
  body: {
    type: String,
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
  isRead: {
    type: Boolean,
    default: false,
  },
  updatedAt: Date,
});

NotificationsSchema.pre('update', function preUpdate(next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  return next();
});

const Notifications = mongoose.model('notifications', NotificationsSchema);

module.exports = Notifications;
