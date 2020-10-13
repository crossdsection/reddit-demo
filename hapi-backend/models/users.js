const mongoose = require("mongoose");
const { Schema } = mongoose;

const Users = new Schema({
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Users", Users);