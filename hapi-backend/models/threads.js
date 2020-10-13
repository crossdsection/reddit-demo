const mongoose = require("mongoose");
const { Schema } = mongoose;

const Threads = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.ObjectId, required: true  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Threads", Threads);