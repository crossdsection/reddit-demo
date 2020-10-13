const mongoose = require("mongoose");
const { Schema } = mongoose;

const Posts = new Schema({
  content: { type: String, required: true },
  threadId: { type: Schema.ObjectId  },
  parentPostId: { type: Schema.ObjectId  },
  userId: { type: Schema.ObjectId, required: true  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Posts", Posts);