const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReplyCounts = new Schema({
  count: { type: Number, required: true  },
  threadId: { type: Schema.ObjectId  },
  postId: { type: Schema.ObjectId  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("ReplyCounts", ReplyCounts);