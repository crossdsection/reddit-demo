const mongoose = require("mongoose");
const { Schema } = mongoose;

const Threads = new Schema({
  title: { type: String },
  content: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Threads", Threads);