const mongoose = require("mongoose");

const user = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

module.exports = mongoose.model("User", user);
