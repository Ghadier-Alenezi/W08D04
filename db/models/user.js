const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default:"https://i.pinimg.com/564x/9e/81/da/9e81da69381d9920b0f1a264ce5d0879.jpg" },
  isDel: { type: Boolean, default: false },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role",  default:"61a750d07acff210a70d2b8c" },
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
