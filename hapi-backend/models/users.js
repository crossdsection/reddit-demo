const mongoose = require("mongoose");
const { Schema } = mongoose;

const Users = new Schema({
  password: { type: String },
  email: { type: String, unique: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Users", Users);