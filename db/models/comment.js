const mongoose = require("mongoose");

const comment = new mongoose.Schema(
  {
    desc: { type: String },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", comment);
