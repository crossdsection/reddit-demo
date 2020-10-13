const mongoose = require("mongoose");
const { Schema } = mongoose;

const Posts = new Schema({
  content: { type: String },
  threadId: {},
  parentPostId: {},
}, {
  timestamps: true,
});

module.exports = mongoose.model("Posts", Posts);