const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReactionTypes = new Schema({
  codes: { type : 'string'},
  char: { type : 'string'},
  name: { type : 'string'},
  category: { type : 'string'},
  group: { type : 'string'},
  subgroup: { type : 'string'},
}, {
  timestamps: true,
});

module.exports = mongoose.model("ReactionTypes", ReactionTypes);