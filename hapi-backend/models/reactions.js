const mongoose = require("mongoose");
const { Schema } = mongoose;

const Reactions = new Schema({
  reactionTypeId: { type: Schema.ObjectId, required: true  },
  userId: { type: Schema.ObjectId, required: true  },
  threadId: { type: Schema.ObjectId  },
  postId: { type: Schema.ObjectId  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Reactions", Reactions);