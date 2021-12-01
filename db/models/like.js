const mongoose = require("mongoose");

const like = new mongoose.Schema(
  {
    isLiked: { type: Boolean, default: false },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", like);
