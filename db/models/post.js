const mongoose = require("mongoose");

const post = new mongoose.Schema({
  title: { type: String },
  desc: { type: String, required: true },
  img: { type: String },
  createdAt: { type: Date, default: Date.now() },
  isDel: { type: Boolean, default: false },
  likeCount: {
    type: Number,
    default: 0,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", post);
