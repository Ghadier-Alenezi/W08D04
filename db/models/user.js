const mongoose = require("mongoose");

const user = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  isDel: { type: Boolean, default: false },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

user.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }
  next();
});
user.methods.comparePassword = async function (password) {
  const result = await bcrypt.compareSync(password, this.password);
  return result;
};
module.exports = mongoose.model("User", user);
