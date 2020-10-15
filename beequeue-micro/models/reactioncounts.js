const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReactionCounts = new Schema({
  count: { type: Number, required: true  },
  threadId: { type: Schema.ObjectId  },
  postId: { type: Schema.ObjectId  },
  reactionTypeId: { type: Schema.ObjectId },
  users: [mongoose.Schema.Types.Mixed]
}, {
  timestamps: true,
});

module.exports = mongoose.model("Reactions", Reactions);