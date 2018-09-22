const mongoose = require('mongoose');

const { Schema } = mongoose;

const MetaSchema = new Schema({
  metaName: String,
  metaValue: String,
});

const Meta = mongoose.model('meta', MetaSchema);

module.exports = Meta;
