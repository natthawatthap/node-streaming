const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: String,
  path: String,
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
