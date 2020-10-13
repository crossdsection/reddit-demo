const mongoose = require("mongoose");
const { Schema } = mongoose;

const Posts = new Schema({
  content: { type: String, required: true },
  threadId: { type: Schema.ObjectId, required: true  },
  parentPostId: { type: Schema.ObjectId, required: true  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Posts", Posts);