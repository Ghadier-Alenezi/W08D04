const express = require("express");
const userRouter = express.Router();

const {
  register,
  login,
  users,
  deleteUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googlelogin
} = require("../controllers/user");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");
const isResetTokenValid = require("../middleware/user");
const user = require("../../db/models/user");

// any user can register and login
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verifyEmail", verifyEmail);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.post("/resetPassword", isResetTokenValid, resetPassword);
// log in with google
userRouter.post("/api/googlelogin", googlelogin)
// only admin can show all users and delete a user
userRouter.get("/users", authentication, authorization, users);
userRouter.put("/user/:id", authentication, authorization, deleteUser);
// in this task we need soft delete

module.exports = userRouter;
